const assert = require('assert');

function createRoutes (app, db) {
    
    // todas las funciones que interactuen con la base de datos van aquí
    app.get('/', (request, response) => {
        response.sendFile(__dirname + '/public/home.html');

        
    });

    app.get('/api/Tienda', (request, response) => {
        
        // seleccionamos la colección que necesitamos
        const products = db.collection('productos');

        // buscamos todos los productos
        products.find({})
            // transformamos el cursor a un arreglo
            .toArray((err, result) => {
                // asegurarnos de que no hay error
                assert.equal(null, err);

                response.send(result);
                console.log(result);
            });

    })
    
    app.get('/tienda', (request, response) => {
        
        // seleccionamos la colección que necesitamos
        const products = db.collection('productos');

        // buscamos todos los productos
        products.find({})
            // transformamos el cursor a un arreglo
            .toArray((err, result) => {
                // asegurarnos de que no hay error
                assert.equal(null, err);

                var context = {
                    products: result

                };

                response.render('Tienda',context);
            });

    })

    app.post('/api/Tienda', (request, response) => {
        console.log(request.body);

        const products = db.collection('productos');
        products.insert(request.body);

        response.send({
            message: 'ok',
        });
    });
    app.get('/Tienda', (request, response) => {
        var id = request.params.id;
        console.log(id);
 
        var products = db.collection('productos');
        products.find({"_id": new ObjectID(id)})
         .toArray((err, result) => {
             assert.equal(null, err);
                 
                 var context = {
                     products: result[0]
                 };
 
                 console.log(context);
                 response.render('productos', context);
         });
    });
    app.get('/productosDetail/:id', function (req, res) {
        const products = db.collection('productos');
        var query= {};        
        products.find({})
        // transformamos el cursor a un arreglo
        .toArray((err, result) => {
            // asegurarnos de que noh ay error
            
            //
            var c=0;
            for(c;c<result.length;c++){
                if(req.params.id.toString()===result[c]._id.toString()){
                    //result[c].cartLength= cartList.length,
                    res.render('productosDetail', result[c]);
                }
                
            }
            
            
        });
        
    });
}

module.exports = createRoutes;