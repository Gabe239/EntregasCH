const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = 'C:/src/carrito.json'

const generateId = (carts) => {
    const ids = carts.map(cart => cart.id);
      const maxId = carts.length;

      for (let i = 1; i <= maxId; i++) {
          if (!ids.includes(i)) {
              return i;
          }
      }
      return carts.length + 1
};


router.post('/', (req, res) => {
    
  
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading carrito file:', err);
        res.status(500).json({ error: 'Error al crear el carrito' });
        return;
      }

      const carts = JSON.parse(data);

      const newCart = {
        id: generateId(carts),
        products: []
      };

      carts.push(newCart);
  
      fs.writeFile(path, JSON.stringify(carts), (err) => {
        if (err) {
          console.error('Error writing carrito file:', err);
          res.status(500).json({ error: 'Error al crear el carrito' });
          return;
        }
  
        res.status(201).json(newCart);
      });
    });
  });
  
  router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
  
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading carrito file:', err);
        res.status(500).json({ error: 'Error al obtener el carrito' });
        return;
      }
  
      const carts = JSON.parse(data);
      const cart = carts.find((c) => c.id == cartId);
  
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
      }
    });
  });
  
  router.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
  
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading carrito file:', err);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
        return;
      }
  
      const carts = JSON.parse(data);
      const cart = carts.find((c) => c.id == cartId);
  
      if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
      }
  
      const product = cart.products.find((p) => p.product == productId);
  
      if (product) {
        
        product.quantity++;
      } 
      else {
        
        cart.products.push({
          product: productId,
          quantity: 1
        });
      }
  
      fs.writeFile(path, JSON.stringify(carts), (err) => {
        if (err) {
          console.error('Error writing carrito file:', err);
          res.status(500).json({ error: 'Error al agregar el producto al carrito' });
          return;
        }
  
        res.json(cart.products);
      });
    });
  });
  
  
  module.exports = router;