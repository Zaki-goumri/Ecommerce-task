import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel';
import { StatusCode } from '../types/StatusCode';

export interface ExtendedRequest extends Request {
    user?:any,
    userToken?:string
}


export const validateJWT = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        res.status(StatusCode.UNAUTHORIZED).json({ message: 'Unauthorized '});
        return;
    }
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
        res.status(StatusCode.UNAUTHORIZED).json({ message: 'Unauthorized '});
        return;
    }
    if (!process.env.SECRET_KEY) {
        res.status(StatusCode.INTERNAL_ERROR).json({ message: 'Internal Server Error' });
        return;
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
        if (err) {
                req.userToken=token
            res.status(StatusCode.UNAUTHORIZED).send('expired token'); 
            return;
        }
        if (!payload){
            res.status(StatusCode.UNAUTHORIZED).json({ message: 'User not Found'});
        }
        try {
            const userPlayload = payload as {
                email: string,
                firstName: string,
                lastName: string,
            };
            const user = await userModel.findOne({ email: userPlayload.email });
            req.user = user;
            next();
        } catch (error) {
            res.status(StatusCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
        }
    });
};