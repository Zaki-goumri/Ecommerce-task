import  { Cart } from "../models/cartModel";
import { IOrderItem, orderModel } from "../models/orderModel";
import productModel from "../models/productModel";


const createActiveCart = async (userId: string) => {
    const cart = await Cart.create({ userId, status: 'active', items: [], totalAmount: 0 });
    return cart;
}


export const getActiveCart = async (Id: string) => {
    let cart = await Cart.findOne({userId:Id, status: 'active' })
    if (!cart) {
        cart =await createActiveCart(Id);
    }
    const cartItems = await Promise.all(cart.items.map(async (item) => {
        const product = await productModel.findById(item.productID);
        return {
            productID: item.productID,
            _id: item.productID._id,
            productTitle: product?.title,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        };
    }));
    
    cart.items = cartItems
    
    return cart;
}


interface IAddItemToCart {
    userID: string;
    product: any;
    quantity: number;
}
  
export const addItemToCart = async (addedItem:IAddItemToCart) =>{

        let cart  = await getActiveCart(addedItem.userID);
        const ExistingItem = cart.items.find((i) => i.productID.toString() === addedItem.product);

        if (ExistingItem) {
            const product = await productModel.findById(ExistingItem.productID);
            if (!product) {
                return {statusbar:404,message:'Product not found'}
            }
            if (product.stock < ExistingItem.quantity + addedItem.quantity) {
                return {statusbar:400,message:'Not enough stock'}
            }
            
            ExistingItem.quantity += addedItem.quantity;
            cart.totalAmount += addedItem.quantity * ExistingItem.unitPrice;

            const updatedCart = await cart.save();
            return {statusbar:200,message:'increment quantity'}
        }
        const product = await productModel.findById(addedItem.product);
        if (!product) {
            return {statusbar:404,message:'Product not found'}
        }
        if (product.stock < addedItem.quantity) {
            return {statusbar:400,message:'Not enough stock'}
        }   
        cart.totalAmount += addedItem.quantity * product.price;
       cart.items.push({ productID: product, quantity: addedItem.quantity, unitPrice: product.price,productTitle: product.title });
       
       const updatedCart = await cart.save();
        return {statusbar:200,message:'Item added to cart'}
    }
    interface updateItemToCart {
        userID: string;
        product: any;
        quantity: number;
    }

    export const updateItemToCart = async (updatedItem:updateItemToCart) => {
        const cart = await getActiveCart(updatedItem.userID);
        if (!cart){
            return {statusbar:404,message:'Cart not found'}
        }
        const ExistingItem = cart.items.find((i) => i.productID.toString() === updatedItem.product);
        if (!ExistingItem) {
            return {statusbar:404,message:'Item not found'}
        }
        const product = await productModel.findById(ExistingItem.productID);
        if (!product) {
            return {statusbar:404,message:'Product not found'}
        }
        if (product.stock < updatedItem.quantity) {
            return {statusbar:400,message:'Not enough stock'}
        }
        ExistingItem.quantity = updatedItem.quantity
        
        const oldItems = cart.items.filter((item) => 
            item.productID.toString() !== updatedItem.product
         );
        let totalAmount = oldItems.reduce(
            (acc, item) => {
            acc =+ item.quantity * item.unitPrice
            return acc
        }, 0);
        
        totalAmount += updatedItem.quantity * product.price;
        cart.totalAmount = totalAmount;
        
        await cart.save();
         
        return {statusbar:200,message:cart}
    }       

    interface deleteItemToCart {
        userID: string;
        product: any;
        quantity: number;
    }

    export const deleteItemToCart = async (deletedItem:deleteItemToCart) => {  
    const cart = await getActiveCart(deletedItem.userID);
    if (!cart){
        return {statusbar:404,message:'Cart not found'}
    }
    const ExistingItem = cart.items.find((i) => i.productID.toString() === deletedItem.product);
    if (!ExistingItem) {
        return {statusbar:404,message:'Item not found'}
    }
    const product = await productModel.findById(ExistingItem.productID);
    if (!product) {
        return {statusbar:404,message:'Product not found'}
    }
        const oldItems = cart.items.filter((i) => i.productID.toString() !== deletedItem.product);
        cart.items = oldItems;
        const deletedAmount = ExistingItem.quantity * ExistingItem.unitPrice;
        cart.totalAmount -= deletedAmount;
        await cart.save();
       
    return {statusbar:200,message:cart}
}

export const cleanCart = async (userId: string) => {
    const cart = await Cart.findOne({ userId, status: 'active' });
    if (!cart) {
        return {statusbar:404,message:'Cart not found'}
    }
    cart.items = [];
    cart.totalAmount = 0
    await cart.save();
    return {statusbar:200,message:'Cart cleaned'}
}


interface ICheckoutCart {
    userID: string;
    address: string ;
}

const getActiveCartWithoutCreating = async (Id: string) => {
    let cart = await Cart.findOne({userId:Id, status: 'active' })
    return cart; ;
}




export const checkoutCart = async ({userID,address}:ICheckoutCart) => {
   if (!address) {
       return {statusbar:400,message:'Address is required'}
   }
   const orderItems: IOrderItem[] = [];

    const cart = await getActiveCartWithoutCreating(userID);
    if (!cart){
        return {statusbar:404,message:'Cart not found'}
        
    }else if (cart.items.length === 0) {
        return {statusbar:400,message:'Cart is empty'}
    }
    
    for (const item of cart.items) {
        const product = await productModel.findById(item.productID);
        if (!product) {
            return {statusbar:404,message:'Product not found'}
        }
        const orderItem : IOrderItem = {
            productTitle: product.title,
            productImage: product.image,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        }
        const productStock = product.stock - item.quantity;
        product.stock = productStock;
        await product.save();
        orderItems.push(orderItem);
    }
     
    const order = await orderModel.create({
        userId: userID,
        orderItems: orderItems,
        status: 'completed',
        orderAmount: cart.totalAmount,
        address: address
    });
    order.save();
    cart.status = 'completed';
    await cart.save();
    return {statusbar:200,message:'Order completed'}

}