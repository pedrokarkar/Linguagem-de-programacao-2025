const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

const carroPath = path.join(__dirname, 'carros.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

function salvarDados(carros) {
    fs.writeFileSync(carrosPath, JSON.stringify(carros, null, 2));
}

app.get('/atualizar-carro', (req, res) => {
    res.sentFile(path.join(__dirname, 'atualizandocarro.html'));
});

app.post('/atualizar-carro', (req, res) => {
    const { nome, novaDescricao, novaUrlInfo, novaUrlFoto, novaUrlVideo } = req.body;
    let carrosData = fs.readFileSync(carroPath, 'utf-8');
    let carros = JSON.parse(carrosData);

    const carroIndex = carros.findIndex(carro => carro.nome.toLowerCase() === nome.toLowerCase());

    if (carroIndex === -1) {
        res.send('<h1>Carro não encontrado.</h1>');
        return
    }

    carros[carroIndex].desc = novaDescricao;
    carros[carroIndex].url_info = novaUrlInfo;
    carros[carroIndex].url_foto = novaUrlFoto;
    carros[carroIndex].url_video = novaUrlVideo;

    salvarDados(carros);

    res.send('<h1>Dados do carro atualizados com sucesso!</h1>');
});

app.listen(port, () => {
    console.log(`Servidor iniciado em https://localhost${port}`)
})