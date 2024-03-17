import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { token } from '../config'

export const SECRET_KEY: Secret = token;

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        console.log(token);

        if (!token) {
            throw new Error('Error de autenticacion. Verifica tus credenciales');
        }
        // const decoded = jwt.verify(token, SECRET_KEY);
        // (req as CustomRequest).token = decoded;

        // console.log('Este es el payload ',decoded);
        // console.log(typeof decoded);

        next();
    } catch (err) {
        let error = err as Error
        res.status(401).json({message: error.message, status:401});
    }
};