"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// PizZip is required because docx/pptx/xlsx files are all zipped files, and
// the PizZip library allows us to load the file in memory
var PizZip = require("pizzip");
var Docxtemplater = require("docxtemplater");
var fs = require("fs");
var path = require("path");
function createDocx(template, info) {
    // Load the docx file as binary content
    var content = fs.readFileSync(path.resolve("".concat(__dirname, "/templates"), "".concat(template, ".docx")), "binary");
    // Unzip the content of the file
    var zip = new PizZip(content);
    // This will parse the template, and will throw an error if the template is
    // invalid, for example, if the template is "{user" (no closing tag)
    var doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });
    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    doc.render(info);
    // Get the zip document and generate it as a nodebuffer
    return doc.getZip().generate({
        type: "nodebuffer",
        // compression: DEFLATE adds a compression step.
        // For a 50MB output document, expect 500ms additional CPU time
        compression: "DEFLATE",
    });
    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    // fs.writeFileSync(path.resolve(`${__dirname}/templates`, "template_final.docx"), buf);
}
exports.default = createDocx;
// console.log(createDocx('template_carta_compromiso', info))
var info = {
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
};
