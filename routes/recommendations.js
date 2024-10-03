const express = require("express");
const router = express.Router();
const tf = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");

const { Product } = require("../models/product");
const service = require("../services/products");

let model;

const loadModel = async () => {
    model = await use.load();
};

loadModel();

router.post("/", async (req, res) => {
    const { productId } = req.body;

    if (!productId) return res.status(400).send({ error: "Invalid product id" });

    const viewedProduct = await Product.findById(productId);
    if (!viewedProduct)
        return res.status(400).send({ error: "Product not found" });
    const viewedEmbedding = await getProductEmbeddings([
        viewedProduct.description,
    ]);

    const products = await service.findAll();
    const productEmbeddings = await getProductEmbeddings(
        products.map((p) => p.description)
    );

    return productEmbeddings.map((embedding) => {
        const dotProduct = viewedEmbedding[0].reduce(
            (sum, val, idx) => sum + val * embedding[idx],
            0
        );

        const normA = Math.sqrt(
            viewedEmbedding[0].reduce((sum, val) => sum + val * val, 0)
        );

        const normB = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));

        return dotProduct / (normA * normB);
    });
});

async function getProductEmbeddings(descriptions) {
    const embeddings = await model.embed(descriptions);

    return embeddings.arraySync();
}

module.exports = router;
