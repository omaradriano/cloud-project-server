import { Router, Request, Response, NextFunction } from 'express'
// mover jwt
import jwt from 'jsonwebtoken'
// Mongodb
import { MongoClient } from 'mongodb'
import { mongouri, token } from '../config'
// Using bcrypt to hash
import bcrypt from 'bcrypt'
// Conexion mongodb
const uri = mongouri;

interface User {
    name: string
    email: string
}

const auth = Router()

auth.post('/signup', async (req: Request<User>, res: Response) => {
    const client = new MongoClient(uri);
    const { name, email, password } = req.body
    let saltRounds = 8
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
        } else {
            let hashedpass = await bcrypt.hash(password, saltRounds)
            let query = { "name": name, "email": email, "password": hashedpass }
            await collection.insertOne(query)
            res.status(200).json({ message: "Registrado correctamente", status: 200 })
        }
    } catch (err) {
        let error = err as Error
        console.log(error.message);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
})

auth.get('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // PENDIENTE
        const client = new MongoClient(uri);

        const { email, password } = req.body;

        const db = client.db('school');
        const collection = db.collection('users');
        // check if user exists
        const userExists = await collection.findOne({ email: email }, { projection: { "_id": 0, "password": 1, "name":1 } });
        if (!userExists) throw new Error('Error en autenticacion')

        // Recuperar contrasena con el hash
        let validpass = await bcrypt.compare(password, userExists.password).catch(err => {throw new Error(err)})

        // validate the password
        if (!validpass) throw new Error('Error en autenticacion')

        // generate the token
        const tokenjwt = jwt.sign({ name: userExists.name }, token, {
            expiresIn: '2h',
        });
        res.status(200).json({message: "Loggeado correctamente", tokenjwt, status: 200})
        console.log('Loggeado');
    } catch (error) {
        let err = error as Error
        console.log(err.message);
        res.status(401).json({message: 'No se ha podido iniciar sesion', status: 401})
    }
})

export default auth
