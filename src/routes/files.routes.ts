import createDocx from '../generatedoc'
import path from 'path'
import fs from 'fs'
import { convertWordFiles } from 'convert-multiple-files'
import { Router, Request, Response } from 'express'

const docs = Router()

docs.get('/download/:file/:type', async (req: Request, res: Response) => {
    const info = req.body
    let { file, type } = req.params

    try {
        await createDocx(`template_${file}`, info);
        /** Ruta donde se encuentra alojado el archivo autogenerado docx */
        const entryFilePath = path.resolve(__dirname, "..", 'templates', 'auto_generated_files', 'auto_generated.docx');

        if (type === 'docx') {
            /** Establece headers en caso de mandar un docx */
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            res.setHeader("Content-Disposition", `attachment; filename=${file}.docx`);

            if (!fs.existsSync(entryFilePath)) throw new Error('El archivo docx no existe o no se genero correctamente')

            const docxBuffer = fs.readFileSync(entryFilePath)
            res.status(200).send(docxBuffer)

        } else if (type === 'pdf') {
            /** Establece headers en caso de enviar un pdf */
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=${file}.pdf`);
            /** Aqui se almacena el archivo pdf generado */
            const outputDirPath = path.resolve(__dirname, "..", 'templates', 'auto_generated_files');
            // console.log('Aqui el pdf');

            /** Verifica que el archivo pdf exista, en caso de que si, lo envía. Sino, manda error xd */
            if (!fs.existsSync(entryFilePath)) throw new Error('No se ha podido obtener el archivo docx')

            /** Convertir el archivo docx a pdf */
            await convertWordFiles(entryFilePath, 'pdf', outputDirPath)

            /** Obtiene la ruta del pdf para enviarse */
            const pdfPath = path.resolve(__dirname, "..", 'templates', 'auto_generated_files', 'auto_generated.pdf')

            if(!fs.existsSync(pdfPath)) throw new Error('No se pudo obtener el archivo pdf')
            const pdfBuffer = fs.readFileSync(pdfPath)
            res.status(200).send(pdfBuffer)      
        }
        // console.log("Lectura para borrar los archivos");
        fs.readdir(path.resolve(__dirname, "..", 'templates', 'auto_generated_files'), (err, archivos) => {
            if (err) throw new Error('Error al leer el directorio auto_generated_files')
            // Itera sobre cada archivo en el directorio
            archivos.forEach(nombreArchivo => {
                // Obtiene la ruta completa del archivo
                const rutaArchivo = path.join(path.resolve(__dirname, "..", 'templates', 'auto_generated_files'), nombreArchivo);
                // Borra el archivo
                fs.unlink(rutaArchivo, err => {
                    if (err) throw new Error('Error al borrar un archivo')
                    console.log(`Archivo ${nombreArchivo} eliminado`);
                });
            });
        });
    } catch (error) {
        let messageError = (error as Error).message
        console.log(messageError);
        res.status(500).send(messageError);
    } finally {

    }
})

export default docs