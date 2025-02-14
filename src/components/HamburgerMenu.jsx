import React from 'react';

const HamburgerMenu = ({ menuOpen, setMenuOpen, setView }) => {
    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 1100,
            textAlign: 'right'
        }}>
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="hamburger-menu"
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: 'white'
                }}
            >
                ☰
            </button>
            {menuOpen && (
                <div
                    className="hamburger-menu-links"
                    style={{
                        padding: '10px',
                        borderRadius: '6px',
                        marginTop: '5px'
                    }}
                >
                    <a
                        href="https://sql-learning-journey-tracker.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: 'white',
                            display: 'block',
                            margin: '5px 0'
                        }}
                    >
                        SQL Topics
                    </a>
                    <a
                        href="http://devhints.io/mysql"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: 'white',
                            display: 'block',
                            margin: '5px 0'
                        }}
                    >
                        Check Syntax
                    </a>
                    <a
                        href="https://github.com/BryanLomerio"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: 'white',
                            display: 'block',
                            margin: '5px 0'
                        }}
                    >
                        GitHub
                    </a>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setView("problems");
                            setMenuOpen(false);
                        }}
                        style={{
                            color: 'white',
                            textDecoration: 'underline',
                            display: 'block',
                            margin: '5px 0'
                        }}
                    >
                        Problems
                    </a>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
