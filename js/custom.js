/* Fonction pour convertir la température d'une unité à une autre */
/* vta  = valeur de la température à convertir */
/* utie = unité de départ à convertir */
/* utoe = unité dans laquelle doit être convertie la température */
/* La fonction retourne la valeur convertie */
function temperatureConvert(vte, utie, utoe) {
	if(typeof(vte) === 'number') {
		switch(utie) {
			case 'c' :
				var tokelvin    = vte + 273.15;
				var tocelcius   = vte;
				var tofarenheit = 32 + 1.8 * vte;
				break;
			case 'f' :
				var tokelvin    = (vte + 459.67) / 1.8;
				var tocelcius   = (vte - 32) / 1.8;
				var tofarenheit = vte;
				break;
			case 'k' :
				var tokelvin    = vte;
				var tocelcius   = vte - 273.15;
				var tofarenheit = (vte * 1.8) - 459.67;
				break;
			default :
				var tokelvin    = 'N/A';
				var tocelcius   = 'N/A';
				var tofarenheit = 'N/A';
				break;
		}
		switch(utoe) {
			case 'c' :
				var tConverted = tocelcius;
				break;
			case 'f' :
				var tConverted = tofarenheit;
				break;
			case 'k' :
				var tConverted = tokelvin;
				break;
			default :
				var tConverted = vte;
				break;
		}
	} else {
		var tConverted = 'NaN';
	}
	return tConverted;
}

/* Fonction pour dessiner les arcs de cercles en fonction de la température */
/* plb     = lieu où se trouve la sonde (ID unique) */
/* vtb     = valeur numérique de la température */
/* utob    = unité de la tepérature */
/* vtblow  = seuil d'alerte minimal */
/* vtbhigh = seuil d'alerte maximal */
function tempGraph(plb, vtb, utib, vtblow, vtbhigh) {
	if(typeof(vtb) === 'number') {
		var finaltb = temperatureConvert(vtb, utib, 'c');
		var canvas = document.getElementById(plb);
		var context = canvas.getContext('2d');
		var guide = canvas.getContext('2d');
		var zero = canvas.getContext('2d');
		var x = canvas.width / 2;
		var y = canvas.height / 2;
		var startAngle = 0.5 * Math.PI ;
		var endRuler = 1.75 * Math.PI;
		var starting = -10;
		var ending = 40;
		var halfCircle = 40;
		var xZero = x - 22;
		var yZero = y + 12;
		if(finaltb > ending) {
			var endAngle = endRuler;
		} else if(finaltb < starting) {
			var endAngle = startAngle + 0.1;
		} else {
			var endAngle = (0.75 * Math.PI) + (finaltb * Math.PI / halfCircle);
		}
		var couleur = '#999999';
		var coulfnd = '#ffffff';
		if((vtb < vtblow) || (vtb > vtbhigh)) {
			couleur = '#ffffff';
			coulfnd = '#cc0000';
		}
		var counterClockwise = false;
		/* traçage du repere de guidage du graphe visible */
		guide.beginPath();
		guide.arc(x, y, 29, startAngle, endRuler, counterClockwise);
		guide.lineWidth = 3;
		guide.strokeStyle = couleur;
		guide.stroke();
		/* traçage du graphe dans la plage visible */
		context.beginPath();
		context.arc(x, y, 35, startAngle, endAngle, counterClockwise);
		context.lineWidth = 15;
		context.strokeStyle = couleur;
		context.stroke();
		/* positionnement du zéro */
		zero.fillStyle = coulfnd;
		zero.fillRect (xZero, yZero, 10, 10);
	}
}

/* Fonction pour afficher la température de manière formatée */
/* vta       = valeur de la température */
/* unita     = unité de la température */
/* alerttemp = définit si affichage en alerte [true|false] */
function displayTemp(vta, unita, alerttemp) {
	if(typeof(vta) === 'number') {
		if(vta < 0) {
			var tsigna = -1;
		} else {
			var tsigna = 1;
		}
		var absvta = Math.abs(vta);
		var intvta = Math.floor(absvta);
		var decvta = Math.floor((absvta - intvta ) * 10);
		intvta = intvta * tsigna;
		switch(unita) {
			case 'c':
				var unitName = 'degrés Celcius';
				var unitClass = 'celcius';
				var unitSign = '°C';
				break;
			case 'f':
				var unitName = 'degrés Farenheit';
				var unitClass = 'farenheit';
				var unitSign = '°F';
				break;
			case 'k':
				var unitName = 'Kelvin';
				var unitClass = 'kelvin';
				var unitSign = 'K';
				break;
			default:
				var unitName = 'N/A';
				var unitClass = '';
				var unitSign = '°?';
				break;
		}
		var alerttempclass = '';
		if(alerttemp) {
			var alerttempclass = "blink";
		}
		document.write('<div class="temp" title="' + vta + ' ' + unitName + '"><span class="' + alerttempclass + '"><span class="value">' + intvta + '</span><span class="decimale">,' + decvta + '</span></span><span class="unit ' + unitClass + '">' + unitSign + '</span></div>');
	} else {
		document.write('<div class="temp" title="valeur inconnue"><span class="blink value">N/A</span></div>');
	}
}

/* Fonction pour afficher le taux d'humidité de manière formatée */
/* vma        = valeur de l'humidité (en pourcentage) */
/* alertmoist = définit si affichage en alerte [true|false] */
function displayMoist(vma, alertmoist) {
	if(typeof(vma) === 'number') {
		var intvma = Math.round(vma);
		var alertmoistclass = '';
		if(alertmoist) {
			var alertmoistclass = "blink";
		}
		document.write('<div class="moist" title="'+vma+'% d\'humidité"><span class="' + alertmoistclass + ' value">' + intvma + '</span><span class="unit">%</span><span class="picto"></span></div>');
	} else {
		document.write('<div class="moist" title="valeur inconnue"><span class="blink value">N/A</span></div>');
	}
}

/* Fonction pour afficher la consommation énergétique de manière formatée */
function displayEnergy() {
	/* voir fonction getEnergy() */
}

/* Fonction de redistribution des valeurs aux fonctions concernées */
/* plc     = lieu où se trouve la sonde */
/* vtc     = valeur numérique de la température */
/* vtclow  = seuil minimal d'alerte de température */
/* vtchigh = seuil maximal d'alerte de température */
/* utic    = unité en entrée de la température de la sonde */
/* utoc    = unité dans laquelle afficher la température à l'écran */
/* vmc     = valeur de l'humidité (en pourcentage) */
/* vmclow  = seuil minimal d'alerte d'humidité */
/* vmchigh = seuil maximal d'alerte d'humidité */
function getData(plc, vtc, vtclow, vtchigh, utic, utoc, vmc, vmclow, vmchigh) {
	var finaltc = temperatureConvert(vtc, utic.toLowerCase(), utoc.toLowerCase());
	var finaltclow = temperatureConvert(vtclow, utic.toLowerCase(), utoc.toLowerCase());
	var finaltchigh = temperatureConvert(vtchigh, utic.toLowerCase(), utoc.toLowerCase());
	var isalert = '';
	var istemp  = '';
	var ismoist = '';
	var isalerttemp = false;
	var isalertmoist = false;
	var alerttempsub = '';
	var alertmoistsub = '';
	if(vtc < vtclow) {
		isalert = 'alert';
		istemp  = 'temper toocold';
		isalerttemp = true;
		alerttempsub = 'trop froid';
	}
	if(vtc > vtchigh) {
		isalert = 'alert';
		istemp  = 'temper toohot';
		isalerttemp = true;
		alerttempsub = 'trop chaud';
	}
	if(vmc < vmclow) {
		isalert = 'alert';
		ismoist = 'moister toodry';
		isalertmoist = true;
		alertmoistsub = 'trop sec';
	}
	if(vmc > vmchigh) {
		isalert = 'alert';
		ismoist = 'moister toowet';
		isalertmoist = true;
		alertmoistsub = 'trop humide';
	}
	if(typeof(finaltc) != 'number') {
		isalert = 'alert';
	}
	document.write('<span class="room ' + isalert + '"><canvas id="' + plc + '" height="100" width="100" class="tempgraph"></canvas>');
	tempGraph(plc, finaltc, utoc, finaltclow, finaltchigh);
	displayTemp(finaltc, utoc, isalerttemp);
	displayMoist(vmc, isalertmoist);
	document.write('<div class="alertzone"><span class="blink alerticon ' + istemp + '" title="' + alerttempsub + '"></span><span class="blink alerticon ' + ismoist + '" title="' + alertmoistsub + '"></span></div>');
	document.write('<div class="location">' + plc + '</div></span>');
}

/* Fonction de formatage des infos météo */
/* trend = nom de la tendance (voir common.css pour les noms disponibles) */
/* vtd   = valeur numérique de la température */
/* utid  = unité en entrée de la température de la sonde */
/* utod  = unité dans laquelle afficher la température à l'écran */
/* vmd   = valeur de l'humidité (en pourcentage) */
function getWeather(trend, vtd, utid, utod, vmd) {
	var finaltd = temperatureConvert(vtd, utid, utod);
	document.write('<span class="room"><div class="pictometeo plein ' + trend + '" alt="' + trend + '"></div>');
	displayTemp(finaltd, utod);
	displayMoist(vmd, false);
	document.write('</span>');
}

/* Fonction de formatage des infos de consommation énergétique */
/* conso     = valeur numérique de la concommation (en Watts) */
/* updown    = tendance par rapport au dernier relevé : 'up' ou autre */
/* consohigh = seuil maximal d'alerte de consommation */
function getEnergy(conso, updown, consohigh) {
	if(typeof(conso) === 'number') {
		var isalert = '';
		var isenergy = '';
		var alertconsoclass = '';
		var alertenergysub = '';
		if(updown == 'up') {
			isalert = 'alert';
			isenergy = 'consomer tooenergy';
			alertconsoclass = '';
			alertenergysub = 'consommation en hausse';
		}
		if(conso > consohigh) {
			isalert = 'alert';
			isenergy = 'consomer tooenergy';
			alertconsoclass = 'blink';
			alertenergysub = 'consommation trop importante';
		}
		document.write('<span class="room ' + isalert + '">');
		document.write('<div class="conso"><span class="' + alertconsoclass + ' value" title="' + conso + ' Watts">' + conso + '</span><span class="unit">W</span></div>');
		document.write('<div class="tendance picto ' + updown + '" alt="' + updown + '"></div>');
		document.write('<div class="alertzone"><span class="blink alerticon ' + isenergy + '" title="' + alertenergysub + '"></span></div>');
		document.write('</span>');
	} else {
		document.write('<span class="room alert">');
		document.write('<div class="conso"><span class="blink value" title="valeur inconnue">N/A</span></div>');
		document.write('<div class="alertzone"><span class="blink alerticon consomer tooenergy" title="valeur inconnue"></span></div>');
		document.write('</span>');
	}
}

/* Fonction clignotteur pour faire clignotter tout et n'importe quoi */
function blink(){
    $('.blink').delay(1000).fadeTo(100,0).delay(100).fadeTo(100,1, blink);
}
