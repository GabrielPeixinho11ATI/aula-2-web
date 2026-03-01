const { useState, useEffect } = React;

const Header = ({ activePage }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('tema');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('tema', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('tema', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(!darkMode);

    return (
        <header>
            <div className="logo-area">
                <i className="fa-solid fa-anchor"></i>
                <span>Loja do Peixinho</span>
            </div>
            <nav style={{ display: 'flex', alignItems: 'center' }}>
                <a href="/" className={activePage === 'home' ? 'active' : ''}>Início</a>
                <a href="/cadastro" className={activePage === 'cadastro' ? 'active' : ''}>Novo Produto</a>
                <a href="/produtos" className={activePage === 'estoque' ? 'active' : ''}>Estoque</a>

                <button
                    onClick={toggleTheme}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent)',
                        fontSize: '1.2rem',
                        marginLeft: '20px',
                        cursor: 'pointer'
                    }}
                    title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
                >
                    <i className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
                </button>
            </nav>
        </header>
    );
};

// Pega a página ativa do atributo data do script ou container
const headerRoot = document.getElementById('header-root');
const activePage = headerRoot.getAttribute('data-active');

const root = ReactDOM.createRoot(headerRoot);
root.render(<Header activePage={activePage} />);
