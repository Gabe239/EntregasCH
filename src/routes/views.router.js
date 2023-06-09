import { Router } from 'express';

import ProductManager from '../ProductManager.js';
const productManager = new ProductManager('./data.json');

const router = Router();

router.get('/', async (req, res) => {
    let products = await productManager.getProducts();
    return res.render('home', {
        title: 'Home',
        products: products
    })
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();

    return res.render("realTimeProducts", {
        title: "Real Time Products",
        products: products,
    });


});

export default router;