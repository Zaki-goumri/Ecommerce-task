import express, { Request, Response } from 'express';
import { ExtendedRequest, validateJWT } from '../middleware/validateJWT';
import {
  addItemToCart,
  checkoutCart,
  cleanCart,
  deleteItemToCart,
  getActiveCart,
  updateItemToCart,
} from '../services/cartService';
import { StatusCode } from '../types/StatusCode';

const route = express.Router();

/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Get active cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart found
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal Server Error
 */
route.get('/', validateJWT, async (req: ExtendedRequest, res: Response) => {
  try {
    const user = await req?.user?._id;
    const cart = await getActiveCart(user._id);
    res.status(StatusCode.OK).send(cart);
  } catch (error) {
    res.status(StatusCode.INTERNAL_ERROR).send('internal error :' + error);
  }
});

/**
 * @swagger
 * /carts/{id}:
 *   post:
 *     summary: Add item to cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
route.post(
  '/:id',
  validateJWT,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const product = req.params.id;
      const userID = req?.user?._id;
      const quantity = req?.body.quantity;
      const result = await addItemToCart({ userID, product, quantity });
      res.status(result.statusbar).send(result.message);
    } catch (error) {
      res.status(StatusCode.INTERNAL_ERROR).send('internal error :' + error);
    }
  }
);

/**
 * @swagger
 * /carts:
 *   patch:
 *     summary: Update item in cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - quantity
 *             properties:
 *               id:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item updated in cart
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
route.patch(
  '/',
  validateJWT,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userID = req?.user?._id;
      const product = req.body.id;
      const quantity = req?.body.quantity;
      const result = await updateItemToCart({ userID, product, quantity });
      res.status(result.statusbar).send(result.message);
    } catch (error) {
      res.status(StatusCode.INTERNAL_ERROR).send('internal error :' + error);
    }
  }
);

/**
 * @swagger
 * /carts/{id}:
 *   delete:
 *     summary: Delete item from cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item deleted from cart
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
route.delete(
  '/:id',
  validateJWT,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userID = req?.user?._id;
      const product = req.params.id;
      const quantity = req?.body.quantity;
      const result = await deleteItemToCart({ userID, product, quantity });
      res.status(result.statusbar).send(result.message);
    } catch (error) {
      res.status(StatusCode.INTERNAL_ERROR).send('internal error :' + error);
    }
  }
);

/**
 * @swagger
 * /carts/clear:
 *   delete:
 *     summary: Clear cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *       500:
 *         description: Internal Server Error
 */
route.delete(
  '/clear',
  validateJWT,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userID = req?.user?._id;
      const result = await cleanCart(userID);
      res.status(result.statusbar).send(result.message);
    } catch (error) {
      res.status(StatusCode.INTERNAL_ERROR).send('internal error :' + error);
    }
  }
);

/**
 * @swagger
 * /carts/checkout:
 *   put:
 *     summary: Checkout cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cart checkout successful
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal Server Error
 */
route.put(
  '/checkout',
  validateJWT,
  async (req: ExtendedRequest, res: Response) => {
    const userID = req?.user?._id;
    const address = req?.body.address;
    try {
      const result = await checkoutCart({ userID, address });
      res.status(result.statusbar).send(result.message);
    } catch (error) {
      res.status(StatusCode.INTERNAL_ERROR).send('internal error :' + error);
    }
  }
);

export default route;