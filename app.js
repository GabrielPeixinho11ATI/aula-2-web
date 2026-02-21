const express = require('express');
const mysql = require('mysql2');
const path = require('path');
// Não precisamos mais do require('body-parser') separado

const app = express();
const port = 3000;

// --- CONFIGURAÇÕES ---

// Configura o Express para ler dados do formulário (Substitui body-parser)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configura pastas estáticas (CSS, Imagens e os HTMLs)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// --- BANCO DE DADOS ---
const connection = mysql.createConnection({
    host: 'benserverplex.ddns.net',
    user: 'alunos',
    password: 'senhaAlunos', // Verifique se seu MySQL tem senha! Se tiver, coloque aqui.
    database: 'web_03mb'
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('✅ Conectado ao MySQL com sucesso!');
});

// --- ROTAS ---

// Rota GET '/' -> Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Rota GET '/cadastro' -> Serve cadastro.html
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastro.html'));
});

// Rota POST '/salvar-produto' -> Recebe os dados e faz INSERT no MySQL
app.post('/salvar-produto', (req, res) => {
    // 1. Pegar dados do formulário
    const { nome, preco, descricao } = req.body;

    // Log para depuração (vai aparecer no seu terminal)
    console.log("Tentando cadastrar:", nome, preco, descricao);

    // 2. Query SQL
    const sql = 'INSERT INTO produtos_Peixinho (nome, preco, descricao) VALUES (?, ?, ?)';

    // 3. Executar no banco
    connection.query(sql, [nome, preco, descricao], (err, result) => {
        if (err) {
            console.error('❌ Erro ao inserir produto:', err);
            res.status(500).send('Erro ao salvar produto no banco de dados. Verifique o terminal.');
            return;
        }

        console.log('✅ Produto cadastrado com ID:', result.insertId);
        // 4. Redirecionar para a lista
        res.redirect('/produtos');
    });
});

// Rota GET '/produtos' -> Serve lista.html
app.get('/produtos', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'lista.html'));
});

// API para buscar produtos (JSON) para o fetch do frontend
app.get('/api/produtos', (req, res) => {
    const sql = 'SELECT * FROM produtos_Peixinho';

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            res.status(500).json({ error: 'Erro ao buscar produtos' });
            return;
        }
        res.json(results);
    });
});

// Rota DELETE '/api/produtos/:id' -> Deleta um produto pelo ID
app.delete('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM produtos_Peixinho WHERE id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('❌ Erro ao deletar produto:', err);
            res.status(500).json({ error: 'Erro ao deletar produto no banco de dados' });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }

        console.log('✅ Produto deletado com sucesso:', id);
        res.json({ message: 'Produto apagado com sucesso!' });
    });
});

// Iniciar o Servidor
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});