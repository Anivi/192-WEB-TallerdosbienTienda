const express = require('express'),
    engines = require('consolidate');

var app = express();

//instalar Mongo
var MongoClient =require('mongodb').MongoClient;
var assert = require('assert');

//Conection URL
const url= 'mongodb://localhost:27017';
const dbName = 'tienda';

//Create Clietn Object
const client = new MongoClient(url, { useNewUrlParser: true});
var db = null;

MongoClient.connect(`mongodb+srv://cluster0-rfkyi.mongodb.net/tienda`, {
    auth:{
        user:'aj-taller',
        password:'ContraseñaSuperSegura123'
    }
},
function(err,client){
    if(err) throw err;
    db = client.db('tienda');
    app.listen(process.env.PORT ||500);
}
);


app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

app.use(express.static('public'));

//---------------//

//Index
app.get( '/', ( req, res ) => {
    res.render('index');
});

//Tienda
app.get('/tienda', (req,res) => {
    var productos= db.collection('productos');
    productos.find().toArray(function(err,docs){
        assert.equal(null,err);
        var contexto ={
            productos:docs
        }
        res.render('tienda',contexto);
    })
});

//Carrito
app.get('/carrito', (req,res) => {
    res.render('carrito');
});

// Producto
app.get('/producto', (req,res) => {
    res.render('producto');
});

    
app.listen(5000);