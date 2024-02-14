// PizZip is required because docx/pptx/xlsx files are all zipped files, and
// the PizZip library allows us to load the file in memory
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

import { Carta_Compromiso } from '../src/docTypes'

const fs = require("fs");
const path = require("path");


export default function createDocx(template: string, info: Carta_Compromiso) {
    //Leer y cargar el contenido como binario
    const content = fs.readFileSync(
        path.resolve(`${__dirname}/templates`, `${template}.docx`),
        "binary"
        );

    // Unzip the content of the file
    const zip = new PizZip(content);

    // This will parse the template, and will throw an error if the template is
    // invalid, for example, if the template is "{user" (no closing tag)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });
    
    //Cargar la informacion recibida dentro del documento
    doc.render(info);
    
    //Construir el documento y generar un buffer
    return doc.getZip().generate({
        type: "nodebuffer",
        // compression: DEFLATE adds a compression step.
        // For a 50MB output document, expect 500ms additional CPU time
        compression: "DEFLATE",
    });
    // fs.writeFileSync(path.resolve(`${__dirname}/templates`, "template_final.docx"), buf);
}

