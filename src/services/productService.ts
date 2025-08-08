import productModel from "../models/productModel";
import redisClient from '../utils/redisClient';
import { IProduct } from '../models/productModel';

// Get all products, with optional category filtering and Redis caching
export async function getAllProducts(category?: string): Promise<IProduct[]> {
    const cacheKey = category ? `products:category:${category}` : 'products:all';
    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }
    const query = category ? { category } : {};
    const products = await productModel.find(query);
    await redisClient.set(cacheKey, JSON.stringify(products), { EX: 60 }); // cache for 60s
    return products;
}

export async function seedInitialProducts() {
    const initialProducts  = [
        {  title: 'T-Shirt', price: 19.99, image: 'https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-a-dos-avenue--N40501_PM1_Worn%20view.png?wid=1090&hei=1090' , stock:67},
        {  title: 'Jeans', price: 49.99, image: 'https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-fastline-messenger--M22482_PM1_Worn%20view.png?wid=1090&hei=1090',stock:45 },
        {  title: 'Jacket', price: 89.99, image: 'https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-trio-messenger--M12490_PM1_Worn%20view.png?wid=1090&hei=1090' ,stock:34},
        {  title: 'Sneakers', price: 69.99, image: 'https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-porte-documents-voyage-nm--N40445_PM1_Worn%20view.png?wid=1090&hei=1090',stock:23 },
      ]
      
        const existingProducts = await getAllProducts();
        if(existingProducts.length === 0 ){
            await productModel.insertMany(initialProducts);
        }
        
    }


export async function getProductById(id: string): Promise<IProduct | null> {
    const cacheKey = `product:${id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }
    const product = await productModel.findById(id);
    if (product) {
        await redisClient.set(cacheKey, JSON.stringify(product), { EX: 60 });
    }
    return product;
}

// Create a new product with validation
export async function createProduct(data: Partial<IProduct>): Promise<IProduct> {
    // Basic validation
    if (!data.title || !data.image || typeof data.price !== 'number' || typeof data.stock !== 'number') {
        throw new Error('Missing required fields');
    }
    const newProduct = new productModel({
        title: data.title,
        image: data.image,
        price: data.price,
        stock: data.stock,
    });
    const saved = await newProduct.save();
    // Invalidate product list cache
    await redisClient.del('products:all');
    return saved;
}