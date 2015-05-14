// Temperature units conversion
// vta  = value of the initial temperature to convert
// utie = unit of the initial value
// utoe = unit of the converted temperature
// The function returns the converted temperature value
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

// Function to draw an arc of a circle depending on the temperature value
// plb     = location of the sensor (unique ID)
// vtb     = temperature value
// utob    = temperature unit
// vtblow  = minimal alert threshold
// vtbhigh = maximal alert threshold
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
		// Tracing the "guide" for the graph (thin line)
		guide.beginPath();
		guide.arc(x, y, 29, startAngle, endRuler, counterClockwise);
		guide.lineWidth = 3;
		guide.strokeStyle = couleur;
		guide.stroke();
		// Tracing the arc for the temperature value (thick line)
		context.beginPath();
		context.arc(x, y, 35, startAngle, endAngle, counterClockwise);
		context.lineWidth = 15;
		context.strokeStyle = couleur;
		context.stroke();
		// Positionning the zero mark
		zero.fillStyle = coulfnd;
		zero.fillRect (xZero, yZero, 10, 10);
	}
}

// Function to display the temperature in a specific HTML way
// vta       = temperature value
// unita     = temperature unit
// alerttemp = is this an alert? [true|false]
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

// Function to display the humidity in a specific HTML way
// vma        = humidity value (in percents)
// alertmoist = is this an alert? [true|false]
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

// Function to display the energy consumption in a specific HTML way
function displayEnergy() {
	// See function getEnergy()
}

// Function to redistribute the values to the appropriate functions
// plc     = location of the sensor
// vtc     = temperature value
// vtclow  = min temperature alert threshold
// vtchigh = max temperature alert threshold
// utic    = unit of the temperature given by the sensor
// utoc    = unit of the temperature to display
// vmc     = humidity value (in percents)
// vmclow  = min humidity alert threshold
// vmchigh = max humidity alert threshold
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

// Function to display the weather data in a specific HTML way
// trend = name of the "trend" (see common.css for available names)
// vtd   = temperature value
// utid  = temperature unit of the sensor
// utod  = temperature unit of the temperature to display
// vmd   = humidity (in percents)
function getWeather(trend, vtd, utid, utod, vmd) {
	var finaltd = temperatureConvert(vtd, utid, utod);
	document.write('<span class="room"><div class="pictometeo plein ' + trend + '" alt="' + trend + '"></div>');
	displayTemp(finaltd, utod);
	displayMoist(vmd, false);
	document.write('</span>');
}

// Function to prepare the energy consumption data
// conso     = value of the consumption (in Watts)
// updown    = tendency according to previous data: value is 'up' or other
// consohigh = max alert threshold
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

// Function to enable blinking
function blink(){
    $('.blink').delay(1000).fadeTo(100,0).delay(100).fadeTo(100,1, blink);
}
