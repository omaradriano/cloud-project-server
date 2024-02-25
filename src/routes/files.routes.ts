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

        if (type === 'docx') {
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            res.setHeader("Content-Disposition", `attachment; filename=${file}.docx`);
            const filePath = path.resolve(__dirname,"..", 'templates', 'auto_generated_files', 'auto_generated.docx')
            if (fs.existsSync(filePath)) {
                const docxBuffer = fs.readFileSync(filePath)
                res.status(200).send(docxBuffer)
            }
        } else if (type === 'pdf') {
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=${file}.pdf`);
            const entryFilePath = path.resolve(__dirname,"..", 'templates', 'auto_generated_files', 'auto_generated.docx');
            const outputDirPath = path.resolve(__dirname,"..", 'templates', 'auto_generated_files');
            console.log('Aqui el pdf');

            if (fs.existsSync(entryFilePath)) {
                await convertWordFiles(entryFilePath, 'pdf', outputDirPath)
                const pdfBuffer = fs.readFileSync(path.resolve(__dirname,"..", 'templates', 'auto_generated_files', 'auto_generated.pdf'))
                res.status(200).send(pdfBuffer)
            } else {
                console.error('El archivo fuente no existe:', entryFilePath);
                res.status(404).send('Archivo fuente no encontrado');
            }
        }
        console.log("Lectura para borrar los archivos");
        fs.readdir(path.resolve(__dirname,"..", 'templates', 'auto_generated_files'), (err, archivos) => {
            if (err) {
                console.error('Error al leer el directorio:', err);
                return;
            }
            // Itera sobre cada archivo en el directorio
            archivos.forEach(nombreArchivo => {
                // Obtiene la ruta completa del archivo
                const rutaArchivo = path.join(path.resolve(__dirname,"..", 'templates', 'auto_generated_files'), nombreArchivo);

                // Borra el archivo
                fs.unlink(rutaArchivo, err => {
                    if (err) {
                        console.error('Error al borrar el archivo:', err);
                        return;
                    }
                    console.log(`Archivo ${nombreArchivo} eliminado`);
                });
            });
        });
    } catch (error) {
        console.error((error as Error).message);
        res.status(500).send("Error al generar el documento");
    } finally {

    }
})

export default docs