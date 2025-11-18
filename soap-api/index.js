const fs = require("fs");
const path = require("path");
const express = require("express");
const soap = require("soap");
const { usuarios, musicas } = require("../shared/data");

const app = express();
const PORT = 3004;
const wsdlPath = path.join(__dirname, "music.wsdl");

const service = {
  MusicService: {
    MusicPortType: {
      ListUsuarios(args, callback) {
        // SOAP RPC geralmente retorna objetos, aqui simplificamos
        callback({ usuarios });
      },
      ListMusicas(args, callback) {
        callback({ musicas });
      },
    },
  },
};

const wsdlXml = fs.readFileSync(wsdlPath, "utf8");

app.listen(PORT, function () {
  soap.listen(app, "/soap", service, wsdlXml);
  console.log(`SOAP server em http://localhost:${PORT}/soap?wsdl`);
});
