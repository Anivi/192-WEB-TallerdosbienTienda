const express = require('express');
const hbs = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'store';
const client = new MongoClient(url, {
    useUnifiedTopology: true
});
var db = null;

client.connect(function (err) {
    if (err) {
        console.error(err);
        return;
    }
    db = client.db(dbName);
});

app.use(express.static('public'));
app.engine('handlebars', hbs({
    extname: '.handlebars',
    defaultLayout: '',
    layoutsDir: path.join(__dirname, 'views')
}));

app.set('view engine', 'handlebars');

app.get('/', function (request, response) {
    response.render('index');
});

app.get('/tienda', function (request, response) {
    const coleccion = db.collection('productos');
    var obj = {}, va = request.query.var, val = request.query.val;
    if (va !== 'general' && va !== 'ordenar') obj[va] = {
        '$eq': val
    };

    coleccion.find(obj).toArray(function (err, docs) {
        if (err) {
            console.log(err);
            response.send(err);
            return;
        }
        if (va === 'ordenar') {
           val ==='precio'?docs.sort((a, b) => {return (a.precio - b.precio)})
            :
            val ==='producto'? docs.sort((a, b) => {
                var n = a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
                return n === 0 && a.name !== b.name ? b.name.localeCompare(a.name) : n;
            })
            :
            docs.sort(() => { return 0.5 - Math.random() });
        }
        var contexto = {
            productos: docs
        };
        response.render('tienda', contexto);
    });
});

app.get('/detalle', function (request, response) {
    const coleccion = db.collection('productos');
    var prod = request.query.producto;

    coleccion.find({
        nombre: {
            '$eq': prod
        }
    }).toArray(function (err, docs) {
        if (err) {
            console.log(err);
            response.send(err);
            return;
        }
        response.render('detalle', {
            producto: docs,
            nombre: docs[0].nombre
        });
    });
});

app.get('/checkout', function (request, response) {
    const coleccion = db.collection('carrito');
    coleccion.find({}).toArray(function (err, docs) {
        if (err) {
            console.log(err);
            response.send(err);
            return;
        }
        var total = 0;
        docs.map((elem) => {
            total += elem.precio;
        });
        response.render('checkout', {
            productos: docs,
            total: total
        });
    });
});

app.get('/informacion', function (request, response) {
    response.render('informacion');
});

app.post('/api/AgregarAlCarrito', function (request, response) {
    const coleccion = db.collection('productos');
    const coleccion2 = db.collection('carrito');
    let titulo = request.body.nombre;
    let cant = request.body.cantidad;

    coleccion.find({
            nombre: {
                '$eq': titulo
            }
        })
        .toArray(function (err, doc) {
            if (err) {
                console.log(err);
                response.send(err);
                return;
            }
            for (let i = 0; i < parseInt(cant); i++) {
                console.log("insertò" + doc);
                coleccion2.insert({
                    categoria: doc[0].categoria,
                    estilo: doc[0].estilo,
                    descripción: doc[0].descripción,
                    nombre: doc[0].nombre,
                    precio: doc[0].precio,
                    color: doc[0].color,
                    imagenes: doc[0].imagenes
                });
            }
        });
});

app.post('/api/vaciarCarrito', function (request, response) {
    const coleccion = db.collection('carrito');
    coleccion.remove({});
    response.send("borrado");
});

app.post('/api/nuevaSolicitud', function (request, response) {
    const coleccion = db.collection('peticiones');
    coleccion.insert({
        nombre: request.body.nombre,
        apellido: request.body.nombre,
        cedula: request.body.cedula,
        direccion: request.body.direccion,
        cuenta: request.body.cuenta,
        fecha: request.body.fecha,
        codigo: request.body.codigo
    });
    response.send("Nueva solicitud creada");
});

Handlebars.registerPartial('nav', `<div class="navBar"><div class="logo"><img class="styleImgLogo" src="./image/imagenes/Logo.png" alt="logo Emilia"></div><div class="navText"><ul class="listText"><li class="barItems"><a class="navBarItems" href="/store?var=general&val=general">Productos</a><ul><li><a href="/store?var=general&val=general">Aretes</a></li><li><a href="">Pulseras</a></li><li><a href="">Collares</a></li><li><a href="">Tobilleras</a></li></ul></li><li class="barItems"><a class="navBarItems" href="#">Tienda</a></li><li class="barItems"><a class="navBarItems" href="#">Contactános</a></li></ul></div><div class="navImg"><ul class="listImg"><li class="barImg"><img class="styleImgMenu" src="./image/imagenes/search.svg" alt=""></li><li class="barImg"><img class="styleImgMenu" src="./image/imagenes/user.svg" alt=""></li><li class="barImg"><img class="styleImgMenu" src="./image/imagenes/shopping-bag.svg" alt=""></li></ul></div></div>`);

Handlebars.registerPartial('foot', `<footer><div class="footerGrupo"><div class="nosotros"><ul class="footerList"><a class="titulo"> <strong>NOSOTROS</strong></a><a class="textoInfo">Nuestra Compañía</a><a class="textoInfo">Ética Empresarial</a><a class="textoInfo">Tiendas y Contácto</a><a class="textoInfo">Compra con Confianza.</a></ul></div><div class="beneficios"><ul class="footerList"><a class="titulo"> <strong>BENEFICIOS</strong></a><a class="textoInfo">Noticias</a><a class="textoInfo">Eventos</a><a class="textoInfo">Obtén Premios</a><a class="textoInfo">Plan de Fidelización</a></ul></div><div class="Contactanos"><ul class="footerList"><a class="titulo"> <strong>CONTÁCTANOS </strong></a><a class="textoInfo">Calle 44a #68a-08 Cali </a><a class="textoInfo">info@accesoriosemilia.com</a><a class="textoInfo">+57 300 342 3657</a></ul></div></div></footer>`);
app.listen(5000);