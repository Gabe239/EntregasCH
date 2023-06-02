const fs = require("fs");

class ProductManager {
  constructor(path) {
      this.path = path;

      this.id = 1;
  }
  findMissingProductId() {

      const ids = this.products.map(product => product.id);
      const maxId = this.products.length;

      for (let i = 1; i <= maxId; i++) {
          if (!ids.includes(i)) {
              return i;
          }
      }
      return this.products.length + 1;
  }
  async addProduct(title, description, price, thumbnail, code, stock) {


      try {

          this.products = await this.getProducts();

          if (!title || !description || !price || !thumbnail || !code || !stock) {
              console.error("Faltan datos para completar la adici?n del producto");
              return;
          }

          if (typeof title !== "string" ||
              typeof description !== "string" ||
              typeof thumbnail !== "string" ||
              typeof price !== "number" ||
              typeof code !== "string" ||
              typeof stock !== "number") {
              console.error("Los datos proporcionados no son v�lidos para la adici�n del producto");
              return;
          }


          if (this.products.find(product => product.code == code)) {
              console.error("El c?digo se repite");
              return;
          }

          const newProduct = {
              title,
              description,
              price,
              thumbnail,
              code,
              stock,
              id: this.findMissingProductId(),
          };

          this.products.push(newProduct);

          await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"), "utf-8");
          console.log("Los productos han sido guardados correctamente.");


      } catch (err) {
          console.error("Error al guardar los productos: " + err);
      }


  }
  async getProducts() {
      try {
          const data = await fs.promises.readFile(this.path, "utf-8");
          this.products = JSON.parse(data);
          return this.products;
      }
      catch (err) {
          console.error("Error al leer el archivo: " + err);
          return [];
      }

  }

  async getProductById(id) {
      //const productById = this.products.find(product => product.id == id);

      try {

          const data = await fs.promises.readFile(this.path, "utf-8");
          const products = JSON.parse(data);
          const productById = products.find(product => product.id == id)
          if (!productById) {
              console.error("Product not found");
          }

          return productById;
      }
      catch (err) {
          console.error("Error al leer el archivo: " + err);
          throw err;
      }



  }
  async updateProduct(title, description, price, thumbnail, code, stock, id) {
      try {
          this.products = await this.getProducts();
          const index = this.products.findIndex(product => product.id == id);
          this.products[index] = {
              title: title,
              description: description,
              price: price,
              thumbnail: thumbnail,
              code: code,
              stock: stock,
              id: id,
          };

          await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"), "utf-8");

          console.log("El producto ha sido actualizado correctamente.");
      }
      catch (err) {
          console.error("Error actualizando el prodcuto", err);
          throw err;
      }
  }
  async deleteProduct(id) {
      try {
          await this.getProducts();
          const index = this.products.findIndex(product => product.id == id);
          this.products.splice(index, 1);

          await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"), "utf-8");

          console.log("El producto ha sido eliminado correctamente.");
      }
      catch (err) {
          console.error("Error eliminando el prodcuto", err);
          throw err;
      }
  }
}

//const productManager1 = new ProductManager("data.json");

//productManager1.getProducts;
//productManager1.addProduct("Producto 1", "Descripci�n del producto 1", 100, "https://ruta/a/la/imagen1.jpg", "ABC123", 10);
//productManager1.addProduct("Producto 6", "Descripci�n del producto 2", 200, "https://ruta/a/la/imagen2.jpg", "DEF4725", 20);
//productManager1.addProduct("Producto 3", "Descripci�n del producto 3", 300, "https://ruta/a/la/imagen3.jpg", "GHI789", 30);
//productManager1.addProduct("Producto 4", "Descripci�n del producto 3", 400, "https://ruta/a/la/imagen3.jpg", "GHI5492", 40);
//productManager1.addProduct("Producto 4", "Descripci�n del producto 3", 400, "https://ruta/a/la/imagen3.jpg", "GHI55592", 40);
//productManager1.deleteProduct(1);
//productManager1.deleteProduct(3);
//productManager1.updateProduct("Deez nuts", "Descripci�n del producto 3", 400, "https://ruta/a/la/imagen3.jpg", "GHI55592", 40, 3)
//showProductsById

module.exports = ProductManager;