import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import ProductManager from './ProductManager.js';


const productManager = new ProductManager('./data.json');

const app = express();

import productsRouter from './routes/productos.js'
import cartRouter from './routes/carts.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use('/api/productos', productsRouter);
app.use('/api/carrito', cartRouter);
app.use('/', viewsRouter);


const server = app.listen(8080, () => console.log('Servidor Express escuchando en el puerto 8080'));
export const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Cliente conectado");
  

  socket.on("add-product", async (newProduct) => {
    try {
      await productManager.addProduct(
        newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.code, newProduct.stock
      );

      console.log('Respuesta del servidor:', newProduct);
      io.emit('product-added', newProduct);
      
    } catch (error) {
      throw new Error("Error eliminando el producto: " + err.message);
      
    }
  });

  socket.on('delete-product', async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      console.log('Producto eliminado id:', productId);
      
        io.emit('product-deleted', productId);
      
      
    } catch (error) {
      throw new Error("Error eliminando el producto: " + err.message);
      
      
    }
  });
});


