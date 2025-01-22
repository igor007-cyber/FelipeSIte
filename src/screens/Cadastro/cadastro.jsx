import './estilo.css';
import { useState } from 'react';

function Cadastro() {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        senha: '',
        endereco: '',
        numeroEndereco: ''
    });

    const [mensagem, setMensagem] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Função para validar CPF
    const validarCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, ''); // Remove todos os caracteres não numéricos

        if (cpf.length !== 11 || /^(.)\1{10}$/.test(cpf)) return false; // CPF com todos os números iguais é inválido

        let soma = 0;
        let resto;

        // Validação do primeiro dígito
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;

        // Validação do segundo dígito
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Valida o CPF antes de prosseguir com o cadastro
        if (!validarCPF(formData.cpf)) {
            setMensagem('CPF inválido.');
            return;
        }

        try {
            const response = await fetch('/api/pessoas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMensagem('Cadastro realizado com sucesso!');
                setFormData({ nome: '', cpf: '', senha: '', endereco: '', numeroEndereco: '' });
            } else {
                const error = await response.json();
                setMensagem(error.error || 'Erro ao realizar o cadastro.');
            }
        } catch (error) {
            console.error('Erro na conexão:', error);
            setMensagem('Erro de conexão com o servidor.');
        }
    };

    return (
        <>
            <div className="container">
                <div className="logo-container">
                    <img className="logo" src="../../src/assets/logo2.png" alt="logo" />
                </div>

                <div className="formulario">
                    <form onSubmit={handleSubmit}>
                        <h2>Cadastro</h2>

                        <label>
                            Nome:
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            CPF:
                            <input
                                type="text"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                required
                                maxLength="11"
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

                        <label>
                            Endereço:
                            <input
                                type="text"
                                name="endereco"
                                value={formData.endereco}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Número do Endereço:
                            <input
                                type="number"
                                name="numeroEndereco"
                                value={formData.numeroEndereco}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label for="bairro">
                            Bairro:
                            <input 
                                type="text" 
                                id="bairro" 
                                name="bairro" 
                                placeholder="Digite seu bairro" />
                        </label>

                        <button type="submit">Cadastrar</button>
                        <p>{mensagem}</p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Cadastro;
