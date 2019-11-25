const express = require('express'),
    engines = require('consolidate');

var app = express();


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
    res.render('tienda');
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