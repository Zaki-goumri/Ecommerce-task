import mongoose,{Document,Schema} from "mongoose";

export interface IProduct extends Document {
    title: string,
    image: string,
    price: number,
    stock: number,
    category?: string // optional for backward compatibility
}

const productSchema = new Schema<IProduct>({
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: false },
});

const productModel= mongoose.model<IProduct>('Products', productSchema);
export default productModel