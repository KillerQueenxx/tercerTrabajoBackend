const express = require('express');
const fs = require('fs').promises;
const ProductManager = require('./ProductManager');

const app = express();
const port = 3000;

const productManager = new ProductManager('products.json');

app.use(express.json());

(async () => {
  try {
    await fs.access('products.json');
  } catch (error) {
    await fs.writeFile('products.json', '[]', 'utf8');
  }
})();

app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const products = await productManager.getProducts(limit);

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid, 10);
    const product = await productManager.getProductById(productId);

    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado.' });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${port}`);
});
