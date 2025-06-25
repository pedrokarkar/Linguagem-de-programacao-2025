const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = 3000;

const cdnBootstrap = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">';

const trabalhosPath = path.join(__dirname, 'trabalhos.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

let trabalhosData = fs.readFileSync(trabalhosPath, 'utf-8');
let trabalhos = JSON.parse(trabalhosData);

function truncarDescricao(descricao, comprimentoMaximo){
    if (descricao.length > comprimentoMaximo) {
        return descricao.slice(0, comprimentoMaximo) + '...';
    }
    return descricao;
}

function salvarDados() {
    fs.writeFileSync(trabalhosPath, JSON.stringify(trabalhos, null, 2));
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/listar', (req, res) => {
    let trabalhosTable = '';

    trabalhos.forEach(trabalho => {

        const descricaoTruncada = truncarDescricao(trabalho.descricao, 100);

        trabalhosTable += `
        <tr>
            <td>${trabalho.titulo}</td>
            <td>${trabalho.materia}</td>
            <td>${descricaoTruncada}</td>
            <td><button class="btn btn-danger" onclick='excluir("${trabalho.titulo}")'>Excluir</button></td>
        </tr>
        `;
    });

    const htmlContent = fs.readFileSync('listar.html', 'utf-8');
    const finalHtml = htmlContent.replace('{{trabalhosTable}}', trabalhosTable);

    res.send(finalHtml);
});

app.get('/atualizar', (req, res) => {
    res.sendFile(path.join(__dirname, 'atualizar.html'));
});

app.get('/filtrar', (req, res) => {
    res.sendFile(path.join(__dirname, 'filtrar.html'));
});

app.get('/excluir', (req, res) => {
    res.sendFile(path.join(__dirname, 'excluir.html'));
});

app.get('/adicionar', (req, res) => {
    res.sendFile(path.join(__dirname, 'adicionar.html'));
});

app.post('/filtrar', (req, res) => {
    const { materia } = req.body;

    let trabalhosTable = '';

    trabalhos.forEach(trabalho => {
        if(trabalho.materia.toLowerCase() == materia.toLowerCase()){

            const descricaoTruncada = truncarDescricao(trabalho.descricao, 100);

            trabalhosTable += `
            <tr>
                <td>${trabalho.titulo}</td>
                <td>${trabalho.materia}</td>
                <td>${descricaoTruncada}</td>
                <td><button class="btn btn-danger" onclick='excluir("${trabalho.titulo}")'>Excluir</button></td>
            </tr>
            `;

        }
    });

    if(trabalhosTable == ''){
        res.send(`
        ${cdnBootstrap}
        <main class="d-flex justify-content-center align-items-center vh-100">
        <div class="text-center">
            <h1>Não foi encontrado nenhum trabalho com essa matéria.</h1>
            <a href="/filtrar" class="btn btn-primary">Voltar</a>
        </main>
        `);
    } else {

        const htmlContent = fs.readFileSync('filtrar-tabela.html', 'utf-8');
        const htmlMateria = htmlContent.replace('{{materiaTrabalho}}', materia);
        const finalHtml = htmlMateria.replace('{{trabalhosTable}}', trabalhosTable);

        res.send(finalHtml);
    }
});

app.post('/adicionar', (req,res) => {
    const novoTrabalho = req.body;

    if(trabalhos.find(trabalho => trabalho.titulo.toLowerCase() === novoTrabalho.titulo.toLowerCase())) {
        res.send(`
        ${cdnBootstrap}
        <main class="d-flex justify-content-center align-items-center vh-100">
        <div class="text-center">
            <h1>Já existe um trabalho com esse nome, não foi possível cadastrar.</h1>
            <a href="/adicionar" class="btn btn-primary">Voltar</a>
        </main>
        `);
        return;
    }

    trabalhos.push(novoTrabalho);

    salvarDados();

    res.send(`
        ${cdnBootstrap}
        <main class="d-flex justify-content-center align-items-center vh-100">
        <div class="text-center">
            <h1>Trabalho adicionado com sucesso!</h1>
            <a href="/adicionar" class="btn btn-primary">Voltar</a>
        </main>
        `);
});

app.post('/excluir', (req, res) => {
    const { titulo } = req.body;

    let trabalhoIndex = trabalhos.findIndex(trabalho => trabalho.titulo.toLowerCase() === titulo.toLowerCase());

    if(trabalhoIndex === -1) {
        res.send(`
        ${cdnBootstrap}
        <main class="d-flex justify-content-center align-items-center vh-100">
        <div class="text-center">
            <h1>Não foi encontrado nenhum trabalho cadastrado com esse nome.</h1>
            <a href="/excluir" class="btn btn-primary">Voltar</a>
        </main>
        `);
    }

    res.send(`
        <script>
            if(confirm('Tem certeza que deseja excluir o trabalho: ${titulo}?')){
                window.location.href = '/excluir-confirmado?titulo=${titulo}';
            } else{
                window.location.href = '/excluir';
            }
        </script>
        `);

});

app.get('/excluir-confirmado', (req, res) => {
    const titulo = req.query.titulo;

    const trabalhoIndex = trabalhos.findIndex(trabalho => trabalho.titulo.toLowerCase() === titulo.toLowerCase());

    trabalhos.splice(trabalhoIndex, 1);

    salvarDados(trabalhos);

    res.send(`
        ${cdnBootstrap}
        <main class="d-flex justify-content-center align-items-center vh-100">
        <div class="text-center">
            <h1>O trabalho: "${titulo}" foi excluído com sucesso!</h1>
            <a href="/excluir" class="btn btn-primary">Voltar</a>
        </main>
        `);
});

app.post('/atualizar', (req, res) => {
    const { titulo, novaMateria, novaDescricao } = req.body;

    let trabalhoIndex = trabalhos.findIndex(trabalho => trabalho.titulo.toLowerCase() === titulo.toLowerCase());

    if(trabalhoIndex === -1) {
        res.send(`
        ${cdnBootstrap}
        <main class="d-flex justify-content-center align-items-center vh-100">
        <div class="text-center">
            <h1>Não foi encontrado nenhum trabalho cadastrado com esse nome.</h1>
            <a href="/atualizar" class="btn btn-primary">Voltar</a>
        </main>
        `);
    }

    trabalhos[trabalhoIndex].materia = novaMateria;
    trabalhos[trabalhoIndex].descricao = novaDescricao;

    salvarDados(trabalhos);

    res.send(`
        ${cdnBootstrap}
        <main class="d-flex justify-content-center align-items-center vh-100">
        <div class="text-center">
            <h1>Dados do trabalho foram atualizados com sucesso!</h1>
            <a href="/atualizar" class="btn btn-primary">Voltar</a>
        </main>
        `);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
});