function formato_numero(numero, decimales, separador_decimal, separador_miles) {
	numero = parseFloat(numero);
	if (isNaN(numero)) {
		return "";
	}

	if (decimales !== undefined) {
		// Redondeamos
		numero = numero.toFixed(decimales);
	}

	// Convertimos el punto en separador_decimal
	numero = numero.toString().replace(".",
			separador_decimal !== undefined ? separador_decimal : ",");

	if (separador_miles) {
		// Añadimos los separadores de miles
		var miles = new RegExp("(-?[0-9]+)([0-9]{3})");
		while (miles.test(numero)) {
			numero = numero.replace(miles, "$1" + separador_miles + "$2");
		}
	}

	return numero;
}

function reFresh() {
	location.reload(true);
}

function redirect(url){
	location.href=url;
}

function sendCalification(cal, item_urlsafe) {
	var theUrl = "/mayorista/calification/:" + item_urlsafe;
	alert('Su calificación con ' + cal + ' estrellas, fue recibida. Gracias');
	$.ajax({
		type : "POST",
		url : theUrl,
		data : ("&calification=" + cal),
		success : function() {
			console.log($(this).serialize());
			reFresh();
		}
	});
}

function getUrl(){
	var info = document.getElementById('medicam').value;
	
	var position = medi.indexOf(info);
	if(position != -1) { 
		var url = "/mayorista/view_medication/:"+safe[position];
		redirect(url);
	}
}