import mongoose,{Document,Schema} from "mongoose";

export interface IUser extends Document {  
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
 const newSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  });

const userModel = mongoose.model<IUser>("User", newSchema);

export default userModel;