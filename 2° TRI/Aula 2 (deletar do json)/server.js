const fs = require('fs');
const path = require('path');
const express = require('express');
const { json } = require('body-parser');

const app = express();
const port = 3000;

const carrosPath = path.join(__dirname, 'carros.json');
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

function salvarDados(carros) {
    fs.writeFileSync(carrosPath, JSON.stringify(carros, null, 2));
}

app.get('/excluir-carro', (req, res) => {
    res.sendFile(path.join(__dirname, 'excluir.html'));
});

app.post('/excluir-carro', (req, res) => {
    const { nome } = req.body;

    let carrosData = fs.readFileSync(carrosPath, 'utf-8');
    let carros = JSON.parse(carrosData);

    const carroIndex = carros.findIndex(carro => carro.nome.toLowerCase() === nome.toLowerCase());

    if (carroIndex === -1) {
        res.send('<h1>Carro nao encontrado</h1>');
        return;
    }

    res.send(`
    <script>
        if(confirm('tem certeza que deseja excluir o carro ${nome}?')){
            window.location.href = '/excluir-carro-confirmado?nome=${nome}';
        } else{
            window.location.href ='/excluir-carro';
        }
    </script>
    `);
});

app.get('/excluir-carro-confirmado', (req, res) => {
    const nome = req.query.nome;
    let carrosData = fs.readFileSync(carrosPath, 'utf-8');
    let carros = JSON.parse(carrosData);

    const carroIndex = carros.findIndex(carro => carro.nome.toLowerCase() === nome.toLowerCase());

    carros.splice(carroIndex, 1);

    salvarDados(carros);

    res.send(`<h1>O carro ${nome} foi excluido com sucesso</h1>`);
});

app.listen(port, () => {
    console.log(`server iniciado em http://localhost:${port}/excluir-carro`);
});