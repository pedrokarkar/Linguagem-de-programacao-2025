const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bem-vindo ao meu servidor Node. js!');
 }

else if (req.url === '/aluno') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ALUNOS.');
 }

else if (req.url === '/professor') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('PROFESSORES.');
 }

else{
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Rota não encontrada!');
 }   
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});