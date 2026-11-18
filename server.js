const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const banco = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'SUA_SENHA',
    database: 'jornal'
});

app.get('/noticias', async (req, res) => {
    try {
        const [noticias] = await banco.query(
            'SELECT * FROM noticias ORDER BY id DESC'
        );

        res.json(noticias);
    } catch (erro) {
        res.status(500).json({
            erro: 'Erro ao buscar notícias'
        });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});