const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

const produtosPath = path.join(__dirname, 'produtos.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function salvarDados(produtos) {
    fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 10));
}

app.get('/atualizar-produtos', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.post('/atualizar-produtos', (req, res) => {
    const { nome, novoPreco } = req.body;

    let produtosData = fs.readFileSync(produtosPath, 'utf-8');
    let produtos = JSON.parse(produtosData);

    const produtoIndex = produtos.findIndex(produto => produto.nome.toLowerCase() === nome.toLowerCase());

    if (produtoIndex === -1) {
        res.send('<h1> Carro não encontrado </h1>')
        return;
    }

    produtos[produtoIndex].preco = novoPreco;

    salvarDados(produtos);

    res.send('<h1> Dados atualizados com sucesso </h1>');
});

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});