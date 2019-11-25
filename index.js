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

app.get('/producto', function (request, response) {
    const coleccion = db.collection('productos');
    var prod = request.query.producto;

    coleccion.find({
        name: {
            '$eq': prod
        }
    }).toArray(function (err, docs) {
        if (err) {
            console.log(err);
            response.send(err);
            return;
        }
        response.render('producto', {
            producto: docs,
            nombre: docs[0].name
        });
    });
});

app.get('/carrito', function (request, response) {
    const coleccion = db.collection('car');
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
        response.render('carrito', {
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
    const coleccion2 = db.collection('car');
    let titulo = request.body.nombre;

    coleccion.find({
            name: {
                '$eq': titulo
            }
        })
        .toArray(function (err, doc) {
            if (err) {
                console.log(err);
                response.send(err);
                return;
            }
                console.log("insertò" + doc);
                coleccion2.insert({
                    name: doc[0].name,
                    Textura: doc[0].Textura,
                    Producto: doc[0].Producto,
                    Tendencia: doc[0].Tendencia,
                    precio: doc[0].precio,
                    tamaño: doc[0].tamaño,
                    color: doc[0].color,
                    imagenes: doc[0].imagenes
                });
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

app.listen(5000);