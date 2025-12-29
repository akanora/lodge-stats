import React from 'react';
import { NavLink } from 'react-router-dom';
import { useServer } from '../context/ServerContext';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { serverTick, setServerTick } = useServer();

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.container}`}>
                <div className={styles.brand}>
                    {/* Logo Placeholder - assuming text for now, or use the image provided if needed */}
                    <span className={styles.brandText}>BHOP<span className={styles.brandAccent}>STATS</span></span>
                </div>

                <div className={styles.links}>
                    <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Recent Times
                    </NavLink>
                    <NavLink to="/top" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Top Players
                    </NavLink>
                    <NavLink to="/bans" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Bans
                    </NavLink>
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
