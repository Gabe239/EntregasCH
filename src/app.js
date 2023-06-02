import express from 'express';
const app = express();

import productsRouter from './routes/productos.js'
import cartRouter from './routes/carts.js'

app.use(express.json());

app.use('/api/productos', productsRouter);
app.use('/api/carrito', cartRouter);

app.listen(8080, () => {
  try {
    console.log('Servidor Express escuchando en el puerto 8080');
  } catch (error) {
    throw new Error('Error al iniciar el servidor:');
  }
});