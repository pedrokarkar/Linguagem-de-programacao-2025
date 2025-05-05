const fs = require('fs');
const path = require('path');
const express = require('express');
 
const app = express();
 
const port = 3000;
 
const carrosPath = path.join(__dirname, 'carros.json');
 
const carrosData = fs.readFileSync(carrosPath, 'utf-8');
const carros = JSON.parse(carrosData);
 
function buscarCarroPorNome(nome) {
    return carros.find(carro => {
        return carro.nome.toLowerCase() === nome.toLowerCase();
    });
}
 
app.get('/buscar-carro/:nome', (req, res) => {
    const nomeDoCarroBuscado = req.params.nome;
 
    const carroEncontrado = buscarCarroPorNome(nomeDoCarroBuscado);
 
    if(carroEncontrado) {
        res.end(`<h1>Carro encontrado:</h1><pre>
        ${JSON.stringify(carroEncontrado, null, 2)} </pre>`);
    } else {
        res.end('<h1>Carro não encontrado.</h1>');
    }
});
 
app.listen(port, () => {
    console.log(`Servidor sendo escutado em http://localhost:${port}`);
});