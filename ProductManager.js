const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  async saveProducts() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      await fs.writeFile(this.path, data, 'utf8');
    } catch (error) {
      console.error('Error al guardar productos:', error);
    }
  }

  async addProduct(productData) {
    if (!productData || !productData.title || !productData.description || !productData.price || !productData.thumbnail || !productData.code || productData.stock === undefined) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    if (this.products.some((product) => product.code === productData.code)) {
      console.error("El código de producto ya existe.");
      return;
    }

    const newProduct = {
      id: this.products.length + 1,
      ...productData,
    };

    this.products.push(newProduct);
    await this.saveProducts();
  }

  getProducts(limit) {
    if (limit) {
      return this.products.slice(0, limit);
    } else {
      return this.products;
    }
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    return product || null;
  }

  async updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...updatedProduct, id };
      await this.saveProducts();
    }
  }

  async deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      await this.saveProducts();
    }
  }
}

module.exports = ProductManager;
