import express, { Request, Response, NextFunction } from 'express'
import dot from 'dotenv'
dot.config()
const port = process.env.PORT || 3005
import bodyParser from 'body-parser'
import createDocx from './scripts'
import { Carta_Compromiso } from './docTypes'

import path from 'path'
import fs from 'fs'

import { convertWordFiles } from 'convert-multiple-files'

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

    server.get('/download/carta_compromiso', async (req: Request, res: Response) => {

        // const info = req.body

        const info: Carta_Compromiso = { //Esta informacion debe de ser remplazada por un req.body el cual debe de contener toda la informacion
            name: 'Omar Adrian Acosta Santiago',
            n_control: '18550685',
            address: 'Parque el retiro #10043 Jardines de Oriente',
            tel: '6145163473',
            career: 'Ingenieria en Sistemas computacionales',
            sem: '12',
            dependency_name: 'Tec 2',
            dependency_address: 'Direccion del lugar',
            responsable: 'Responsable del programa',
            start_day: '5',
            start_month: '6',
            start_year: '2022',
            end_day: '8',
            end_month: '12',
            end_year: '2023',
            actual_day: '12',
            actual_month: '2',
            actual_year: '2024'
        }

        try {
            // Llama a tu función createDocx con la plantilla y los datos apropiados
            await createDocx("template_carta_compromiso", info);

            // Establece los encabezados para la descarga del archivo
            // res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            // res.setHeader("Content-Disposition", `attachment; filename=${'template-formato'}.docx`);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=${'template-formato'}.pdf`);

            const entryFilePath = path.resolve(__dirname, 'templates', 'auto_generated_files', 'auto_generated.docx');
            const outputDirPath = path.resolve(__dirname, 'templates', 'auto_generated_files');

            if (fs.existsSync(entryFilePath)) {
                // El archivo existe, procede con la conversión a PDF
                await convertWordFiles(entryFilePath, 'pdf', outputDirPath)
                const pdfBuffer = fs.readFileSync(path.resolve(__dirname, 'templates', 'auto_generated_files', 'auto_generated.pdf'))
                res.status(200).send(pdfBuffer)
            } else {
                // El archivo no existe, envía un error al cliente o maneja la situación de otra manera
                console.error('El archivo fuente no existe:', entryFilePath);
                res.status(404).send('Archivo fuente no encontrado');
            }
        } catch (error) {
            console.error("Error al generar el archivo .docx:", error);
            res.status(500).send("Error al generar el archivo .docx");
        }

    })

    server.listen(port, () => {
        console.log(`Running server on port ${port}`);
    })

} catch (error) {
    const err = (error as Error).message
    console.log(err);
}