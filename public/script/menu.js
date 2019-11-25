
    window.addEventListener('scroll', navFijo);
    var barra = document.querySelector('.barra');

    function navFijo()
    {
        console.log(scrollY);
        if(scrollY >= 1){
        barra.style.position= 'fixed';
        
        }
    }
/*
    function showText(){
        var text = document.getElementsByClassName('landing__carac-tex');
        text.style.opacity = "1"; 
    }
*/


    var fotos = document.querySelectorAll('.landing__galeria-foto');
    var fotoMostrar = document.querySelector('.landing__galeria-mostrar');
    
function recorrerFotos(foto, index){

    function clickFoto(event){
        var urlImg = foto.style.backgroundImage;
        var urlImgSplit = urlImg.split('/');

        var nombrePunto = urlImgSplit[urlImgSplit.length - 1].split('.');
        var nombre = nombrePunto[nombrePunto.length-2];

        fotoMostrar.style.backgroundImage = " url('imagenes/" + nombre + ".png')";
        fotoMostrar.style.transition = "all ease-in 0.3s";
        console.log(nombre);

    }
    foto.addEventListener('click', clickFoto);
    
} fotos.forEach(recorrerFotos);


  //  console.log(url + "url de la imagen");


  //  interaccion
  //aqui le digo a mi var imagen que es igual al elemento que tiene la clase entre parentesis
  var imagen = document.querySelector(".landing__interaccion-mujer");
/*aqui le asigno a las var el elemento que tiene ese nombre de clase
get.ElementByClassName hace un arreglo vacio en donde mete todos los elementos que coinciden con la clase que se le pasa
y como solo existe un elemento con ese nombre de clase, se toma la primera posicion*/
var rosada = document.getElementsByClassName("rosada")[0];
var roja = document.getElementsByClassName("roja")[0];
var amarilla = document.getElementsByClassName("amarilla")[0];
var azul = document.getElementsByClassName("azul")[0];

//arreglo con las url de las mujeres con colores
var imagenArray = [
    'imagenes/mujerF.png',
    'imagenes/mujerR.png',
    'imagenes/mujerA.png',
    'imagenes/mujerZ.png',
    ]
//el if es para evitar un posible error en caso de que el elemento no haya sido asignado a la variable
if (rosada != null) {
//aqui le asigno el click al elemento
    rosada.addEventListener("click", (e) => {
/* al darle click entonces mi variable imagen, va a cambiar la propiedad src, por una que este en el arreglo (en ste primera posición)
la cual coincide con la imagen de la mujer rosada*/
        imagen.src = imagenArray[0];        
    });
}

if (roja != null) {

    roja.addEventListener("click", (e) => {
        imagen.src = imagenArray[1];
    });
}

if (amarilla != null) {

    amarilla.addEventListener("click", (e) => {
        imagen.src = imagenArray[2];
    });
}

if (azul != null) {

    azul.addEventListener("click", (e) => {
        imagen.src = imagenArray[3];
    });
}


