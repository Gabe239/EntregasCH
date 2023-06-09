document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const renderProducts = (products) => {
        const productsList = document.getElementById('products-list');

        
        const newProductLi = document.createElement('li');
        newProductLi.innerHTML = `
          <p>Title: ${products.title}</p>
          <p>Description: ${products.description}</p>
          <p>Price: ${products.price}</p>
          <p>Thumbnail: ${products.thumbnail}</p>
          <p>Code: ${products.code}</p>
          <p>Stock: ${products.stock}</p>
        `;

        
        productsList.appendChild(newProductLi);
    };
    socket.on('product-added', (newProduct) => {
        
        renderProducts(newProduct);
    });
    //addproduct
    const form = document.getElementById('new-product-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const { title, description, price, thumbnail, code, stock } = form.elements;

        const parsedPrice = parseFloat(price.value);
        const parsedStock = parseInt(stock.value);

        const newProduct = {
            title: title.value,
            description: description.value,
            price: parsedPrice,
            thumbnail: thumbnail.value,
            code: code.value,
            stock: parsedStock
        };

        socket.emit('add-product', newProduct);

        form.reset();
    });


    //delete product
    const deleteForm = document.getElementById('delete-product-form');
    deleteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const productId = document.getElementById('product-id').value;
        socket.emit('delete-product', productId);
        deleteForm.reset();
    });

    const removeProductFromList = (productId) => {
        const productItem = document.getElementById(productId);
        if (productItem) {
            productItem.remove();
        }
    };
    socket.on('product-deleted', (productId) => {
        removeProductFromList(productId);
    });
});
