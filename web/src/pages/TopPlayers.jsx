import React, { useEffect, useState } from 'react';
import { useServer } from '../context/ServerContext';
import { fetchStats } from '../services/api';
import styles from './Home.module.css'; // Reusing styles for consistent table

export default function TopPlayers() {
    const { serverTick } = useServer();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchStats('top', serverTick).then(res => {
            setData(res);
            setLoading(false);
        });
    }, [serverTick]);

    return (
        <div className="container">
            <div className={styles.header}>
                <div>
                    <h5 className={styles.sublabel}>LEADERBOARDS</h5>
                    <h1 className={styles.title}>Top Players</h1>
                    <p className={styles.subtitle}>
                        Best of the best on {serverTick}T.
                    </p>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '80px', textAlign: 'center' }}>#</th>
                            <th>Player</th>
                            <th>Points</th>
                            <th>Last Seen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No players found.</td></tr>
                        ) : (
                            data.map((row, i) => (
                                <tr key={i}>
                                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: i < 3 ? 'var(--color-primary)' : 'inherit' }}>
                                        {i + 1}
                                    </td>
                                    <td>
                                        <div className={styles.playerCell}>
                                            <div className={styles.avatarPlaceholder}>{row.name.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <div className={styles.playerName}>{row.name}</div>
                                                <div className={styles.playerAuth}>{row.auth}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 700, color: '#fff' }}>{row.points}</span>
                                    </td>
                                    <td className={styles.dateCell}>
                                        {/* Handle lastlogin timestamp if it is number */}
                                        {row.lastlogin ? new Date(row.lastlogin * 1000).toLocaleDateString() : 'Unknown'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
