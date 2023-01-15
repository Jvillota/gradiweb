const tarjeta = document.querySelector('#tarjeta'),
	  btnAbrirFormulario = document.querySelector('#btn-abrir-formulario'),
	  formulario = document.querySelector('#formulario-tarjeta'),
	  numeroTarjeta = document.querySelector('#tarjeta .numero'),
	  nombreTarjeta = document.querySelector('#tarjeta .nombre'),
	  logoMarca = document.querySelector('#logo-marca'),
	  firma = document.querySelector('#tarjeta .firma p'),
	  mesExpiracion = document.querySelector('#tarjeta .mes'),
	  yearExpiracion = document.querySelector('#tarjeta .year');
	  ccv = document.querySelector('#tarjeta .ccv');
let datos = [];

// * Volteamos la tarjeta para mostrar el frente.
const mostrarFrente = () => {
	if(tarjeta.classList.contains('active')){
		tarjeta.classList.remove('active');
	}
}

// * Rotacion de la tarjeta
tarjeta.addEventListener('click', () => {
	tarjeta.classList.toggle('active');
});

// * Boton de abrir formulario
btnAbrirFormulario.addEventListener('click', () => {
	btnAbrirFormulario.classList.toggle('active');
	formulario.classList.toggle('active');
});

// * Select del mes generado dinamicamente.
for(let i = 1; i <= 12; i++){
	let opcion = document.createElement('option');
	opcion.value = i;
	opcion.innerText = i;
	formulario.selectMes.appendChild(opcion);
}

// * Select del año generado dinamicamente.
const yearActual = new Date().getFullYear();
for(let i = yearActual; i <= yearActual + 8; i++){
	let opcion = document.createElement('option');
	opcion.value = i;
	opcion.innerText = i;
	formulario.selectYear.appendChild(opcion);
}

// * Input numero de tarjeta
formulario.inputNumero.addEventListener('keyup', (e) => {
	let valorInput = e.target.value;

	formulario.inputNumero.value = valorInput
	// Eliminamos espacios en blanco
	.replace(/\s/g, '')
	// Eliminar las letras
	.replace(/\D/g, '')
	// Ponemos espacio cada cuatro numeros
	.replace(/([0-9]{4})/g, '$1 ')
	// Elimina el ultimo espaciado
	.trim();

	numeroTarjeta.textContent = valorInput;

	if(valorInput == ''){
		numeroTarjeta.textContent = '#### #### #### ####';

		logoMarca.innerHTML = '';
	}

	if(valorInput[0] == 4){
		logoMarca.innerHTML = '';
		const imagen = document.createElement('img');
		imagen.src = 'img/logos/visa.png';
		logoMarca.appendChild(imagen);
	} else if(valorInput[0] == 5){
		logoMarca.innerHTML = '';
		const imagen = document.createElement('img');
		imagen.src = 'img/logos/mastercard.png';
		logoMarca.appendChild(imagen);
	}

	// Volteamos la tarjeta para que el usuario vea el frente.
	mostrarFrente();
});

// * Input nombre de tarjeta
formulario.inputNombre.addEventListener('keyup', (e) => {
	let valorInput = e.target.value;

	formulario.inputNombre.value = valorInput.replace(/[0-9]/g, '');
	nombreTarjeta.textContent = valorInput;
	firma.textContent = valorInput;

	if(valorInput == ''){
		nombreTarjeta.textContent = 'Nombre y Apellidos';
	}

	mostrarFrente();
});

// * Select mes
formulario.selectMes.addEventListener('change', (e) => {
	mesExpiracion.textContent = e.target.value;
	mostrarFrente();
});

// * Select Año
formulario.selectYear.addEventListener('change', (e) => {
	yearExpiracion.textContent = e.target.value.slice(2);
	mostrarFrente();
});

// * CCV
formulario.inputCCV.addEventListener('keyup', () => {
	if(!tarjeta.classList.contains('active')){
		tarjeta.classList.toggle('active');
	}

	formulario.inputCCV.value = formulario.inputCCV.value
	// Eliminar los espacios
	.replace(/\s/g, '')
	// Eliminar las letras
	.replace(/\D/g, '');

	ccv.textContent = formulario.inputCCV.value;
});

  $("#guardar").on("click",function(event){
    event.preventDefault();
	let validar= validarFormulario();
	if(validar){
	//document.getElementById("tabla-registros").innerHTML = "Hello World";
	let numeroCodificado= codificarNumero( formulario.inputNumero.value);
	let dataTemp = {"numerotc": numeroCodificado,
					"nombres": formulario.inputNombre.value,
					"expiracion":formulario.selectMes.value + "/" + formulario.selectYear.value,
					"ccv":formulario.inputCCV.value};
	datos.push(dataTemp);
	genera_tabla(datos);
	console.log(datos);
}else{
	alert("Los campos del formulario son obligatorios");
}
    // resto de tu codigo
 });
 function validarFormulario(){
	if(formulario.inputNumero.value.length==0 || formulario.inputNumero.value.length==0
		|| formulario.selectMes.value=="Mes" || formulario.selectYear.value=="Año" ){
			return false;
		}

		return true;
 }

  function genera_tabla(data) {
	// Obtener la referencia del elemento body
	var body = document.getElementById("tabla-registros");
	body.innerHTML = '';
	// Crea un elemento <table> y un elemento <tbody>
	var tabla   = document.createElement("table");
	var tblBody = document.createElement("tbody");
  
	// Crea las celdas
	for (var i = 0; i < data.length; i++) {
	  // Crea las hileras de la tabla
	  var hilera = document.createElement("tr");
		// Crea un elemento <td> y un nodo de texto, haz que el nodo de
		// texto sea el contenido de <td>, ubica el elemento <td> al final
		// de la hilera de la tabla
		var celda = document.createElement("td");
		var textoCelda = document.createTextNode(data[i].numerotc);
		celda.appendChild(textoCelda);
		hilera.appendChild(celda);

		celda =  document.createElement("td");
		textoCelda = document.createTextNode(data[i].nombres);
		celda.appendChild(textoCelda);
		hilera.appendChild(celda);

		celda =  document.createElement("td");
		textoCelda = document.createTextNode(data[i].expiracion);
		celda.appendChild(textoCelda);
		hilera.appendChild(celda);
	  
  
	  // agrega la hilera al final de la tabla (al final del elemento tblbody)
	  tblBody.appendChild(hilera);
	}
  
	// posiciona el <tbody> debajo del elemento <table>
	tabla.appendChild(tblBody);
	tabla.classList.add("table");
	// appends <table> into <body>
	body.appendChild(tabla); 

	
  }

  function codificarNumero(cadena){
	let cuatroNumeros=cadena.substr(-4,4);
	cadena=cadena.substr(0, cadena.length-4);
	cadena=cadena.replace(/([0-9])/g, 'X');
	return cadena+cuatroNumeros;

  }