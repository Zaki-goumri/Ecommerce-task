import bcrypt from 'bcrypt'
import EmailValidator from 'email-validator'
import userModel, { IUser }  from '../models/userModel'
import jwt from 'jsonwebtoken'


export const generatejAccessToken = (data: any) => {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        throw new Error('SECRET_KEY is not defined');
    }
    return jwt.sign(data, secretKey, {
        expiresIn: '1h',
    });
}

export const generateRefreshToken = (data: any) => {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        throw new Error('SECRET_KEY is not defined');
    }
    return jwt.sign(data, secretKey,{
        expiresIn: '7d',
    });
}


export const register = async (user:IUser) => {
    
if (EmailValidator.validate(user.email) && user.password.trim().length > 0) {
    try {
        const newUser = await userModel.findOne({ email: user.email })
        if (newUser) {
            return { message: 'there is a user uese this email', statusbar: 403 }
        }
        const hashedPassword = await bcrypt.hash(user.password, 10)
        user.password = hashedPassword
        await userModel.create(user)
       const  createdUser = await userModel.findOne({ email: user.email })
        return { message: "you are registerd",accessToken : generatejAccessToken({ email: user.email, firstName: user.firstName, lastName: user.lastName }),refreshToken: generateRefreshToken({ email: user.email, firstName: user.firstName, lastName: user.lastName }),user:createdUser ,statusbar: 201 }
    } catch (err) {
        return { message: 'internal error', statusbar: 500 }
    }
} else 
    return { message: 'wrong in the email or the password', statusbar: 500 }}

interface ILogin{
    email:string,
    password:string
}


    export const login = async (user:ILogin) => {
        if (EmailValidator.validate(user.email) && user.password.trim().length > 0) {
            try {
                const findUser = await userModel.findOne({ email: user.email })
                if (findUser){
                    const comparePassword = await bcrypt.compare(user.password,findUser.password);
                    if(comparePassword){
                        return { message: "you are logged in ",accessToken:generatejAccessToken({ email: findUser.email, firstName: findUser.firstName, lastName: findUser.lastName }),refreshToken: generateRefreshToken({ email: findUser.email, firstName: findUser.firstName, lastName: findUser.lastName }),user:findUser,statusbar: 201 }
                    }else 
                    return {message:'wrong email or password ',statusbar:401}
                }else 
                return {message:'wrong email or password',statusbar:401}
            } catch (error) {
              
                return { message: 'internal error', statusbar: 500 } 
            }
        }else 
       
        return {message:"wrong email or password",statusbar:401

         }
    }

    export const refreshJwt = async (token:string) => {
        try {
            if (!process.env.SECRET_KEY) {
                throw new Error('SECRET_KEY is not defined');
            }
            const payload = jwt.verify(token, process.env.SECRET_KEY) as {
                email: string,
                firstName: string,
                lastName: string,
            };
            if (!payload) {
                throw new Error('User not found');
            }
            const user = await userModel.findOne({ email: payload.email });
            if (!user) {
                throw new Error('User not found');
            }
            const accessToken = generatejAccessToken({ email: user.email, firstName: user.firstName, lastName: user.lastName });
            const refreshToken = generateRefreshToken({ email: user.email, firstName: user.firstName, lastName: user.lastName });
            return { newAccessToken: accessToken, newRefreshToken: refreshToken ,user:user};
        } catch (error) {
            return { message: 'an error occurred' };
        }
    }
