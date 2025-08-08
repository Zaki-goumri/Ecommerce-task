import express from 'express';
import { getAllProducts, getProductById, createProduct } from '../services/productService';
import { StatusCode } from '../types/StatusCode';

const route = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products, optionally filter by category
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category to filter products
 *     responses:
 *       200:
 *         description: List of products
 */
route.get('/', async (req, res) => {
    try {
        const category = req.query.category as string | undefined;
        const products = await getAllProducts(category);
        res.status(StatusCode.OK).send(products);
    } catch (error) {
        res.status(StatusCode.INTERNAL_ERROR).send('internal error');
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
route.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await getProductById(id);
        if (!product) {
            res.status(StatusCode.NOT_FOUND).send('product not found');
        } else {
            res.status(StatusCode.OK).send(product);
        }
    } catch (error) {
        res.status(StatusCode.INTERNAL_ERROR).send('internal error');
    }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - image
 *               - price
 *               - stock
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Invalid data
 */
route.post('/', async (req, res) => {
    try {
        const product = await createProduct(req.body);
        res.status(StatusCode.CREATED).send(product);
    } catch (error: any) {
        res.status(StatusCode.BAD_REQUEST).send(error.message || 'Invalid data');
    }
});

export default route;