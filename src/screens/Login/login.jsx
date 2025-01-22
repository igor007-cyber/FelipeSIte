import './estilo.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
    });

    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const user = await response.json(); // Supondo que a API retorna os dados do usuário
                localStorage.setItem('user', JSON.stringify(user)); // Armazena dados do usuário
                setMensagem('Login realizado com sucesso!');
                navigate('/'); // Redireciona para a Home
            } else {
                setMensagem('Login ou a senha está errada.');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            setMensagem('Erro de conexão com o servidor.');
        }
    };

    const handleCadastro = () => {
        navigate('/cadastro');
    };

    return (
        <div className="container2">
            <div className="logo-container2">
                <img className="logo2" src="../../src/assets/logo2.png" alt="logo" />
            </div>

            <div className="formulario">
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>

                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Senha:
                        <input
                            type="password"
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <div className="botoes">
                        <button className="botao" type="submit">Logar</button>
                        <button className="botao" type="button" onClick={handleCadastro}>
                            Cadastrar
                        </button>
                    </div>

                    <p>{mensagem}</p>
                </form>
            </div>
        </div>
    );
}

export default Login;
