const express = require('express');

const server = express();

server.listen(/*localhost:*/3000);

server.use(express.json());

/**
 * Query params = é o parâmetro de query's ex: ?nome=NodeJS
 * Route params = é o parâmetro que vai no endereço da rota, ex: localhost:3000/cursos/2 onde curso/2 é o parâmetro'
 * Request Body = é o corpo da requisição
 * CRUD = Create, Read, Update and Delete
 * Middlewares = Todo tipo de função que esta entre a chamada e o frontend
 */

const cursos = ['NodeJS', 'JavaScript', 'React Native'];

//Middleware Global
server.use((req, res, next) => {
    console.log(`URL CHAMADA: ${req.url}`);

    return next();
});

//Função para validar se está sendo enviado o Nome no body da requisição
function checkCurso(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({ error: "Nome do curso é obrigatório" });
    }
    return next();
}

function checkIndexCurso(req, res, next) {
    const curso = cursos[req.params.index]
    if (!curso) {
        return res.status(404).json({ error: "O curso não existe" });
    }
    req.curso = curso;
    return next();
}

//Listagem de todos os cursos
server.get('/cursos', (req, res) => {
    return res.json(cursos);
});

//Listagem de um curso
server.get('/cursos/:index', checkIndexCurso, (req, res) => {
    return res.json(req.curso);
});

// Criando um novo curso
server.post('/cursos', checkCurso, (req, res) => {
    const { name } = req.body;
    cursos.push(name);
    return res.json(cursos);
})

// Atualizando um curso
server.put('/cursos/:index', checkCurso, checkIndexCurso, (req, res) => {
    const { index } = req.params;
    const { name } = req.body
    cursos[index] = name;
    return res.json(cursos);
})

// Excluindo um curso
server.delete('/cursos/:index', checkIndexCurso, (req, res) => {
    const { index } = req.params;
    cursos.splice(index, 1);
    return res.json({ message: "Curso deletado com sucesso!!" });
})



