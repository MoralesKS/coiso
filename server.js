const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static('public'));

const banco = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Buscar todas as notícias
app.get('/noticias', async (req, res) => {
    try {
        const [noticias] = await banco.execute(
            'SELECT * FROM noticias ORDER BY id DESC'
        );

        res.json(noticias);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Erro ao buscar notícias.'
        });
    }
});

// PESQUISA INTENCIONALMENTE VULNERÁVEL
app.get('/buscar', async (req, res) => {
    try {
        const titulo = req.query.titulo;

        // Não usar esta forma em aplicações reais.
        const sql =
            `SELECT * FROM noticias WHERE titulo = '${titulo}'`;

        const [resultado] = await banco.query(sql);

        res.json(resultado);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro na pesquisa.'
        });
    }
});

// Cadastro de notícias com parâmetros
app.post('/noticias', async (req, res) => {
    try {
        const { titulo, conteudo } = req.body;

        if (
            typeof titulo !== 'string' ||
            typeof conteudo !== 'string' ||
            !titulo.trim() ||
            !conteudo.trim()
        ) {
            return res.status(400).json({
                erro: 'Preencha todos os campos.'
            });
        }

        const [resultado] = await banco.execute(
            'INSERT INTO noticias (titulo, conteudo) VALUES (?, ?)',
            [titulo.trim(), conteudo.trim()]
        );

        res.status(201).json({
            mensagem: 'Notícia cadastrada!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar notícia.'
        });
    }
});

// Somente acesso local
app.listen(3000, '127.0.0.1', () => {
    console.log('Jornal vulnerável em http://127.0.0.1:3000');
});