import { Router, Request, Response, NextFunction } from 'express'
// mover jwt
import jwt from 'jsonwebtoken'
// Mongodb
import { MongoClient } from 'mongodb'
import { mongouri } from '../config'

// Conexion mongodb
const uri = mongouri;

interface User {
    name: string
    email: string
}

const auth = Router()

auth.post('/signup', async (req: Request<User>, res: Response) => {
    const client = new MongoClient(uri);
    const { name, email } = req.body
    try {
        const db = client.db('school');
        const collection = db.collection('users');
        const queryForUsername = { name: name };
        const queryForEmail = { email: email };
        const checkUsername = await collection.findOne(queryForUsername, { projection: { "_id": 0 } });
        const checkEmail = await collection.findOne(queryForEmail, { projection: { "_id": 0 } });

        if (checkUsername) {
            res.status(401).json({ message: 'El nombre de usuario ya existe', status: 401 })
        } else if (checkEmail) {
            res.status(401).json({ message: 'El correo ya se encuentra registrado', status: 401 })
        }else{
            let query = {"name": name, "email": email}
            await collection.insertOne(query)
            res.status(200).json({message: "Registrado correctamente", status:200})
        }
    } catch (err) {
        let error = err as Error
        console.log(error.message);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
})

export default auth
