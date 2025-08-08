import express from "express";
import {   login, refreshJwt, register } from "../services/userService";
import { ExtendedRequest, validateJWT } from "../middleware/validateJWT";
import { StatusCode } from "../types/StatusCode";

const route = express.Router()


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Internal Server Error
 */
route.post('/register', async(req,res) =>{
    try {
        const user = await req.body;
        const result = await register(user)
        res.status(result.statusbar).send({ message: result.message,user:result.user,
            accessToken:result.accessToken,
            refreshToken:result.refreshToken
        })  
    } catch (error) {
        res.status(StatusCode.INTERNAL_ERROR).send('internal error')
    }
})


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
route.post('/login',async (req,res) =>{
try {
    const user = await req.body
    const result = await login(user)
    res
    .cookie('refreshToken',result.refreshToken,{httpOnly:false})
    .header('Authorization',`Bearer ${result.accessToken}`)
    .status(result.statusbar)
    .send({ message: result.message,user:result.user,
        accessToken:result.accessToken,
        refreshToken:result.refreshToken
    })

} catch (error) {
    res.status(StatusCode.INTERNAL_ERROR).send('internal error')

}
})

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get current user info
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
route.get('/user', validateJWT ,async (req:ExtendedRequest,res) =>{
   
     try {
        const user = req.user;
        if(!user){
            res.status(StatusCode.UNAUTHORIZED).send('unauthorized')
        }
        res.status(StatusCode.OK).send({data:{firstName:user.firstName,lastName:user.lastName,email:user.email}});
      
    } catch (error) {
        res.status(StatusCode.INTERNAL_ERROR).send('internal error')
    }
}
)

route.post('/refershToken',async (req:ExtendedRequest,res) =>{
       try{
            const token = req.body?.refreshToken
            if (token){
                const result = await refreshJwt(token)
                res.status(200).send({message:'token refreshed', newRefreshToken: result.newRefreshToken, newAccessToken: result.newAccessToken ,user:result.user})
            }
    }catch(error){
        res.status(500).send('an error occurred')
    }
})

export default route