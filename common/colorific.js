// Conversion of temp to RGB
// Variation of the Tanner Helland method 
// http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
export function tempToHtml(temp){
	var t;
	var r = 255;
	var g;
	var b;
	if (temp <= 6600){
		t = 99.4708025861 * Math.log(temp / 100) - 161.1195681661;
		if (t > 255) 
			g = 255;
		else if (t < 0)
			g = 0;
		else
			g = Math.round(t);
	} else {
		g = 255;	// Max out at 6600
	}
	if (temp >= 6600) {
		b = 255;	// Max out at 6600
	} else if (temp <= 1900) {
		b = 0; // Min out at 1900
	} else {
		t = (temp / 100) - 10;
		t = 138.5177312231 * Math.log(t) - 305.0447927307;
		if (t > 255) 
			b = 255;
		else if (t < 0)
			b = 0;
		else
			b = Math.round(t);
	}
	return RGBToHtml(255, g, b);
}
export function RGBToHtml(r, g, b){
  if (typeof r === "string") r = parseInt(r);
  if (typeof g === "string") g = parseInt(g);
  if (typeof b === "string") b = parseInt(b);
  return "#" + 
    ("0" + r.toString(16)).slice(-2) +
		("0" + g.toString(16)).slice(-2) +
		("0" + b.toString(16)).slice(-2)
	;	
}