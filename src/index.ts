import express, { Request, Response, NextFunction } from 'express'
import dot from 'dotenv'
dot.config()
import {port} from './config'
import bodyParser from 'body-parser'

import docs from '../src/routes/files.routes'

type WhiteList = Array<string>
const whiteList: WhiteList = ["http://127.0.0.1:3000", "http://localhost:3000"]

try {
    const server = express()

    //Body parser para el cuerpo de las solicitudes con json
    server.use(bodyParser.json({
        limit: '500kb'
    }))

    // Uso de los headers para permitir peticiones de los sitios especificados (Esto es un middleware)
    server.use((req: Request, res: Response, next: NextFunction) => {
        const origin: string | undefined = req.headers.origin;
        if (origin && whiteList.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });

    server.use('/', docs)

    server.listen(port, () => {
        console.log(`Running server on port ${port}`);
    })

} catch (error) {
    const err = (error as Error).message
    console.log(err);
}