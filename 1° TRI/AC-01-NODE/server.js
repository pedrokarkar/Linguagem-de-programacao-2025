const http = require('http');
const url = require('url');
const fs = require('fs');

function readFile(response, file) {
    fs.readFile(file, function (err, data) {
        response.end(data);
    });
}

function callback(request, response) {
    response.writeHead(200, { "Content-type": "application/json; charset=urf-8" })
    var parts = url.parse(request.url);
    var path = parts.path;

    if (path == '/produtos') {
        readFile(response, "produtos.json");
    }
    else if (path == '/clientes') {
        readFile(response, "clientes.json");
    }
    else if (path == '/pedidos') {
        readFile(response, "pedidos.json");
    }
    else if (path == '/categoria') {
        readFile(response, "categoria.json");
    }
    else {
        response.end("path não mapeado: " + path);
    }
}

var server = http.createServer(callback);
server.listen(3000);
console.log("srv rodando em http://localhost:3000")