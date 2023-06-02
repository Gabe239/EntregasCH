const express = require('express');
const app = express();

const productsRouter = require('./routes/productos.js');
const cartRouter = require('./routes/carrito.js')


app.use(express.json());

app.use('/api/productos', productsRouter);
app.use('/api/carrito', cartRouter);

app.listen(8080, () => {
    console.log('Servidor Express escuchando en el puerto 8080');
});