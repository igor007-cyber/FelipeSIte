import dotenv from 'dotenv';
import express from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Secret para geração do JWT
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta';

// Rota de cadastro de pessoas
app.post('/api/pessoas', async (req, res) => {
    const { nome, cpf, senha, endereco, numero_endereco } = req.body;

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const result = await pool.query(
            'INSERT INTO pessoas (nome, cpf, senha_hash, endereco, numero_endereco) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [nome, cpf, senhaHash, endereco, numero_endereco]
        );
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar pessoa' });
    }
});

// Rota de login
app.post('/api/login', async (req, res) => {
    const { cpf, senha } = req.body;

    try {
        const result = await pool.query('SELECT id, nome, senha_hash FROM pessoas WHERE cpf = $1', [cpf]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'CPF ou senha inválidos' });
        }

        const user = result.rows[0];
        const senhaValida = await bcrypt.compare(senha, user.senha_hash);

        if (!senhaValida) {
            return res.status(401).json({ error: 'CPF ou senha inválidos' });
        }

        // Geração do token JWT
        const token = jwt.sign({ id: user.id, nome: user.nome }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ id: user.id, nome: user.nome, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
});

// Rota para listar produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produtos');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
});

// Middleware de autenticação para rotas protegidas
const autenticar = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado, token não fornecido' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

// Exemplo de rota protegida
app.get('/api/protegido', autenticar, (req, res) => {
    res.status(200).json({ message: `Bem-vindo, ${req.user.nome}` });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
