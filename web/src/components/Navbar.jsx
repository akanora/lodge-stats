import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useServer } from '../context/ServerContext';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { serverTick, setServerTick } = useServer();
    const [sourceBansConfig, setSourceBansConfig] = useState({ enabled: 0, url: '' });

    useEffect(() => {
        // Fetch SourceBans configuration
        fetch('/stats/api/index.php?endpoint=sourcebans')
            .then(res => res.json())
            .then(data => setSourceBansConfig(data))
            .catch(err => console.error('Failed to fetch SourceBans config:', err));
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.container}`}>
                <div className={styles.brand}>
                    <img src="/stats/assets/img/favicon.png" alt="Lodge Logo" className={styles.logo} />
                    <span className={styles.brandText}>LODGE<span className={styles.brandAccent}>STATS</span></span>
                </div>

                <div className={styles.links}>
                    <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Recent Times
                    </NavLink>
                    <NavLink to="/top" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Top Players
                    </NavLink>
                    <NavLink to="/map" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Maps
                    </NavLink>
                    {sourceBansConfig.enabled === 1 && (
                        <a href={sourceBansConfig.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                            Bans
                        </a>
                    )}
                </div>

                <div className={styles.tickSelector}>
                    <button
                        className={`${styles.tickBtn} ${serverTick === '100' ? styles.activeTick : ''}`}
                        onClick={() => setServerTick('100')}
                    >
                        100 Tick
                    </button>
                    <button
                        className={`${styles.tickBtn} ${serverTick === '128' ? styles.activeTick : ''}`}
                        onClick={() => setServerTick('128')}
                    >
                        128 Tick
                    </button>
                </div>
            </div>
        </nav>
    );
}
