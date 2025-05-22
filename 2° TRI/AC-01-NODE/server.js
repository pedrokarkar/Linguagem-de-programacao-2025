const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

const pedidosPath = path.join(__dirname, 'pedidos.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let pedidosData = fs.readFileSync(pedidosPath, 'utf-8');
let pedidos = JSON.parse(pedidosData);

function salvarDados() {
    fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));
}

function buscarPedido(mesa) {
    return pedidos.find(pedido =>
        pedido.mesa.toLowerCase() === mesa.toLowerCase());
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

app.get('/consultar', (req, res) => {
    res.sendFile(path.join(__dirname, 'consultar.html'));
});

app.get('/consultar-todos', (req, res) => {
    res.send(`<h1>Pedidos encontrados:</h1><pre>
        ${JSON.stringify(pedidos, null, 5)} <p>Clique <a href="http://localhost:3000/">AQUI</a> para voltar</p></pre>`);
});

app.get('/inserir', (req, res) => {
    res.sendFile(path.join(__dirname, 'inserir.html'));
});

app.get('/excluir', (req, res) => {
    res.sendFile(path.join(__dirname, 'excluir.html'));
});

app.get('/excluir-pedido', (req, res) => {
    const mesa = req.query.mesa;
    const pedidoIndex = pedidos.findIndex(pedido => pedido.mesa.toLowerCase() === mesa.toLowerCase());

    pedidos.splice(pedidoIndex, 1);

    salvarDados(pedidos);

    res.send('<h1>Pedido Excluido</h1>  <br>  <a href="http://localhost:3000/">Voltar</a>');
});

app.get('/atualizar', (req, res) => {
    res.sendFile(path.join(__dirname, 'atualizar.html'));
});

app.get('/atualizar2', (req, res) => {
    res.sendFile(path.join(__dirname, 'atualizar2.html'));
});


/////////////////////////////////////////////////////////////////////////////////

app.post('/inserir', (req, res) => {
    const novoPedido = req.body;

    pedidos.push(novoPedido);

    salvarDados();

    res.send('<h1>Pedido adicionado</h1> <br>  <a href="http://localhost:3000/">Voltar</a>');
});

app.post('/atualizar', (req, res) => {
    const { mesa, novosItens } = req.body;

    const pedidoIndexMesa = pedidos.findIndex(pedido => pedido.mesa.toLowerCase() === mesa.toLowerCase());

    if (pedidoIndexMesa === -1) {
        res.send('<h1>Pedido não encontrado</h1>  <br>  <a href="http://localhost:3000/">Voltar</a> ');
        return;
    }

    pedidos[pedidoIndexMesa].itens = novosItens;

    salvarDados();

    res.send('<h1>Dados Atualizados</h1>   <br>  <a href="http://localhost:3000/">Voltar</a>');
});

app.post('/atualizar2', (req, res) => {
    const { cliente, novosItens } = req.body;

    const pedidoIndexCliente = pedidos.findIndex(pedido => pedido.cliente.toLowerCase() === cliente.toLowerCase());

    if (pedidoIndexCliente === -1) {
        res.send('<h1>Pedido não encontrado</h1>  <br>  <a href="http://localhost:3000/">Voltar</a> ');
        return;
    }

    pedidos[pedidoIndexCliente].itens = novosItens;

    salvarDados();

    res.send('<h1>Dados Atualizados</h1>   <br>  <a href="http://localhost:3000/">Voltar</a>');
});

app.post('/consultar', (req, res) => {

    const mesaBuscada = req.body.mesa;

    const pedidoEncontrado = buscarPedido(mesaBuscada);

    if (pedidoEncontrado) {
        res.send(`<h1>Pedido encontrado</h1> <br> <pre> ${JSON.stringify(pedidoEncontrado, null, 2)} </pre> <br>  <a href="http://localhost:3000/">Voltar</a>`)
    }
    else {
        res.send('<h1>Pedido não Encontrado</h1> <br>  <a href="http://localhost:3000/">Voltar</a>')
    }
});

app.post('/excluir', (req, res) => {
    const { mesa } = req.body;
    const pedidoIndex = pedidos.findIndex(pedido => pedido.mesa.toLowerCase() === mesa.toLowerCase());

    if (pedidoIndex === -1) {
        res.send('<h1>Pedido não encontrado</h1>  <br>  <a href="http://localhost:3000/">Voltar</a> ');
        return;
    }

    res.send(`
    <script> 
    if (confirm('Tem certeza de que deseja excluir o pedido ${mesa}?')) { 
    window.location.href = '/excluir-pedido?mesa=${mesa}'; 
    } else { 
    window.location.href = '/excluir'; 
    } 
    </script> 
    `);
});


////////////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
