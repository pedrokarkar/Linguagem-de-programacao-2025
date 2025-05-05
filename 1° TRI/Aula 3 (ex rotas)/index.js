const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Bem-vindo ao meu servidor Node. js!');
    }

    else if (req.url === '/clientes') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('CLIENTES.');
    }

    else if (req.url === '/fornecedores') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('FORNECEDORES.');
    }

    else if (req.url === '/produtos') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('PRODUTOS.');
    }

    else if (req.url === '/vendas') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('VENDAS.');
    }

    else if (req.url === '/vendedores') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('VENDEDORES.');
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Rota não encontrada!');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});