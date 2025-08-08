import mongoose,{Document,ObjectId,Schema} from "mongoose";

export interface IOrder extends Document {
    userId: string | ObjectId;
    orderItems: IOrderItem[];
    status: 'active' | 'completed'; 
    orderAmount: number;
    address: string;

} 
export interface IOrderItem  {
    productTitle: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
}

const orderItemSchema = new Schema<IOrderItem>({
    productTitle: { type: String, required: true },
    productImage: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true }
});



const orderSchema = new Schema<IOrder>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],
    status: { type: String, required: true, enum: ['active', 'completed'] },
    orderAmount: { type: Number, required: true ,default:0},
    address: { type: String, required: true }
});

export const orderModel = mongoose.model<IOrder>('Order', orderSchema);
