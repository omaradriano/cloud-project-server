"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var port = process.env.PORT || 3005;
var body_parser_1 = require("body-parser");
var scripts_1 = require("./scripts");
var whiteList = ["http://127.0.0.1:3000", "http://localhost:3000"];
try {
    var server = (0, express_1.default)();
    //Body parser para el cuerpo de las solicitudes con json
    server.use(body_parser_1.default.json({
        limit: '500kb'
    }));
    // Uso de los headers para permitir peticiones de los sitios especificados (Esto es un middleware)
    server.use(function (req, res, next) {
        var origin = req.headers.origin;
        if (origin && whiteList.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    server.post('/download/carta_compromiso', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var info, docxBuffer;
        return __generator(this, function (_a) {
            info = req.body;
            // res.set({
            //     'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            //     'Content-Disposition': 'attachment; filename="documento_generado.docx"',
            // });
            // const buf = createDocx('template_carta_compromiso', info)
            // res.send(buf)
            // res.send('ola')
            try {
                docxBuffer = (0, scripts_1.default)("mi_plantilla", info);
                // Establece los encabezados para la descarga del archivo
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                res.setHeader("Content-Disposition", "attachment; filename=".concat('template-formato', ".docx"));
                // Envía el archivo como respuesta
                res.send(docxBuffer);
            }
            catch (error) {
                console.error("Error al generar el archivo .docx:", error);
                res.status(500).send("Error al generar el archivo .docx");
            }
            return [2 /*return*/];
        });
    }); });
    server.listen(port, function () {
        console.log("Running server on port ".concat(port));
    });
}
catch (error) {
    var err = error.message;
    console.log(err);
}
