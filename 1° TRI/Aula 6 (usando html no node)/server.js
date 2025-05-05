const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

const carrosPath = path.join(__dirname, 'carros.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Servir arquivos estáticos

let carrosData = fs.readFileSync(carrosPath, 'utf-8');
let carros = JSON.parse(carrosData);

function salvarDados() {
    fs.writeFileSync(carrosPath, JSON.stringify(carros, null, 2));
}

app.get('/adicionar-carro', (req, res) => {
    res.sendFile(path.join(__dirname, 'adicionarcarro.html'));
});

app.post('/adicionar-carro', (req, res) => {
    const novoCarro = req.body;

    if (carros.find(carro => carro.nome.toLowerCase() === novoCarro.nome.toLowerCase())) {
        return res.send('<script>alert("Carro ja existe. Nao foi possivel adicionar duplicatas."); window.location.href = "/adicionar-carro";</script>');
    }

    carros.push(novoCarro);
    salvarDados();
    res.send('<script>alert("Carro adicionado com sucesso!"); window.location.href = "/adicionar-carro";</script>');
});

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}/adicionar-carro`);
});