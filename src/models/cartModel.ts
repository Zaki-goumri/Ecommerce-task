import mongoose, { ObjectId, Schema } from "mongoose";
import { IProduct } from "./productModel";


export interface ICartItem  {
    productID: IProduct;
    quantity: number;
    unitPrice: number;
    productTitle?: string;
}

export interface ICart extends Document {
    userId: string | ObjectId;
    items: ICartItem[];
    status: 'active' | 'completed'; 
    totalAmount: number;

}

const cartItemSchema = new Schema<ICartItem>({
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    quantity: { type: Number, required: true ,default:1},
    unitPrice: { type: Number, required: true } 
});


const cartSchema = new Schema<ICart>({
    userId: { type:String ,required: true },
    items: [{
        productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        productTitle: { type: String, required: false }
    }],
    status: { type: String, required: true, enum: ['active', 'completed'],default:'active' },
    totalAmount: { type: Number, required: true }
});

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
