const fs = require('fs');
const path = require('path');
const express = require('express');


const app = express();
const port = 3000;

const experimentosPath = path.join(__dirname, 'experimentos.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

let experimentosData = fs.readFileSync(experimentosPath, 'utf-8');
let experimentos = JSON.parse(experimentosData);


function salvarDados() {
    fs.writeFileSync(experimentosPath, JSON.stringify(experimentos, null, 2));
}

function buscarExperimento(nome){
    return experimentos.find(experimento =>
     experimento.nome.toLowerCase() === nome.toLowerCase());
}

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'main.html'))
})

app.get('/consultar', (req,res) => {
    res.sendFile(path.join(__dirname, 'consultar.html'))
})

app.get('/consultar/todos', (req,res) => {
    res.send(`<h1>Experimentos encontrados:</h1><pre>
        ${JSON.stringify(experimentos, null, 5)} <p>Clique <a href="http://localhost:3000/consultar">AQUI</a> para voltar</p></pre>`);
})

app.get('/consultar/:nome', (req,res) => {
    const nomeExperimentoBuscado = req.params.nome;
    const experimentroEncontrado =  buscarExperimento(nomeExperimentoBuscado);

    if(experimentroEncontrado){
        res.send(`<h1>Experimento encontrado:</h1><pre>
        ${JSON.stringify(experimentroEncontrado, null, 10)} <p>Clique <a href="http://localhost:3000/consultar">AQUI</a> para voltar</p></pre>`);
    }
    else{
        res.send(`<h1>Experimento não encontrado.</h1> Clique <a href="http://localhost:3000/consultar">AQUI</a> para voltar</h1>`);
    }
});

app.get('/inserir', (req, res) => {
    res.sendFile(path.join(__dirname, 'inserir.html'));
});


app.post('/inserir', (req, res) => {
    const novoExperimento = req.body;

    
if (experimentos.find(experimentos => experimentos.nome.toLowerCase() === novoExperimento.nome.toLowerCase())) {
    res.send('<h1>Experimento já existe, não é possível adicionar duplicatas. Clique <a href="http://localhost:3000/inserir">AQUI</a>para voltar</h1>');
     return;
}

    
experimentos.push(novoExperimento);

   
salvarDados();

    
res.sendFile(path.join(__dirname, 'main.html'));
});


app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});

