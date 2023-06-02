const express = require('express');
const router = express.Router();

const ProductManager = require('C:/src/ProductManager.js');
const productManager = new ProductManager("./data.json");



router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();

    if (!isNaN(limit)) {
      
      res.json(products.slice(0, limit));
    } 
      
    res.json(products);
    
  }
  catch (err) {
    console.error('Error al enviar los productos:', err);
    res.status(500).json({ error: 'Error al enviar los productos' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid); 
    const product = await productManager.getProductById(productId); 

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  }
  catch (err) {
    console.error('Error al enviar los productos:', err);
    res.status(500).json({ error: 'Error al enviar los productos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    newProduct.id = await productManager.findMissingProductId();
    await productManager.addProduct(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const product = await productManager.getProductById(productId);
    
    if (product) {
      const updatedFields = { ...product, ...updatedProduct };
      await productManager.updateProduct(productId, updatedFields);
      res.json(updatedFields);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    
    if (product) {
      await productManager.deleteProduct(productId);
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
