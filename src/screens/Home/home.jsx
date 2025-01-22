import './estilo.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="container">
            <div className="header">
                <div className="Logo1">
                    <img className="logo1" src="../../src/assets/logo2.png" alt="logo" />
                </div>
                <div className={`menu`}>
                    <nav className="menu-nav">
                        <ul>
                            <li><a className="nave" href="#">Home</a></li>                           
                            <li><a className="nave" href="#">Produtos</a></li>
                            <li><Link to="/cadastro" className="nave">Cadastrar</Link></li>
                            <li><a className="nave" href="#">Sobre</a></li>
                        </ul>
                    </nav>
                </div>
                <div className="icon">
                    {user ? (
                        <>
                            <span className="login">{user.nome}</span>
                            <button className="logout" onClick={handleLogout}>Sair</button>
                        </>
                    ) : (
                        <Link to="/login" className="login">Login</Link>
                    )}
                </div>
            </div>

            <div className="corpo">
            <div className="corpo">
                <div className="modelo">

                <div className='video-container'>
                    <iframe 
                        src="../../src/assets/modelos/CaioSports.mp4" 
                        allow="autoplay; encrypted-media; picture-in-picture" 
                        allowfullscreen
                        frameborder>
                    </iframe>
                </div>
                     <h3 className='tesxto'>Temos aqui modelos de varios tipos</h3> 

                    <div className='img-produtos'>
                        <div>
                            <img src="../../src/assets/modelos/roupa.jpeg" alt="roupa" />
                            <p>Roupas</p>
                        </div>
                        
                        <div>
                            <img src="../../src/assets/modelos/sapato.jpg" alt="Sapatos" />
                            <p>Sapatos</p>
                        </div>

                        <div>
                            <img src="../../src/assets/modelos/acessorio.jpeg" alt="Acessórios" />
                            <p>Acessórios</p>
                        </div>
                    </div>
                </div>

                <div className="mostruario-instagram">
                    <a className='instagram' href="https://www.instagram.com/caio_sports2023/">
                        <img className='imgInstagram' src="../../src/assets/modelos/instagram.png" alt="instagram" />
                    </a>
                </div>

                <div className="Compra">
                    <div className='pessoa'>
                        <img className='pessoa-modelo' src="../../src/assets/pessoa.png" alt="pessoa" />
                    </div>
                    <div>
                        <p>
                            <img className='apresentacao' src="../../src/assets/modelos/chamada.png" alt="nossos produtos" />
                        </p>
                        <a href="#" className='link-img-modelo'>
                            <img src="../../src/assets/modelos/seta.png" alt="link dos produtos" />
                        </a>
                    </div>
                </div>
            </div>
            </div>

            <div className="footer">
                <div>
                    <img src="../../src/assets/logo2.png" alt="logo" />
                    <p>Caio Sports 2023</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
