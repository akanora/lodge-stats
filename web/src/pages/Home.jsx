import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useServer } from '../context/ServerContext';
import { fetchStats } from '../services/api';
import { Search } from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
    const { serverTick } = useServer();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('times'); // 'times' or 'records'
    const [error, setError] = useState(null);
    const [serverStats, setServerStats] = useState({
        players_online: 0,
        max_players: 0,
        records_today: 0
    });

    // Fetch live server stats
    useEffect(() => {
        const fetchServerStats = () => {
            fetchStats('stats', serverTick)
                .then(res => {
                    setServerStats(res);
                })
                .catch(err => console.error('Failed to fetch server stats:', err));
        };

        fetchServerStats();
        // Refresh every 30 seconds
        const interval = setInterval(fetchServerStats, 30000);
        return () => clearInterval(interval);
    }, [serverTick]);

    // Handle search
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length >= 3) {
            setIsSearching(true);
            fetchStats('search', serverTick, { q: query })
                .then(res => {
                    setSearchResults(res);
                    setIsSearching(false);
                })
                .catch(err => {
                    console.error('Search failed:', err);
                    setIsSearching(false);
                });
        } else {
            setSearchResults([]);
        }
    };

    // Convert SteamID3 to SteamID2 format
    const convertToSteamID2 = (steamid3) => {
        if (!steamid3 || isNaN(steamid3)) return steamid3;

        const accountId = parseInt(steamid3);
        const y = accountId % 2;
        const z = Math.floor(accountId / 2);
        return `STEAM_0:${y}:${z}`;
    };

    // Format time to MM:SS.ms or SS.ms
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = (seconds % 60).toFixed(2);
        return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : `${secs}s`;
    };

    // Fetch recent times/records
    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchStats('recent', serverTick, { type: activeTab })
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch stats:', err);
                setError(err.message);
                setLoading(false);
            });
    }, [serverTick, activeTab]);

    return (
        <div className="container">
            <div className={styles.header}>
                <div>
                    <h5 className={styles.sublabel}>LIVE FEED</h5>
                    <h1 className={styles.title}>Recent Activity</h1>
                    <p className={styles.subtitle}>
                        Real-time records from our {serverTick}T servers. Times are synchronized globally.
                    </p>
                </div>

                <div className={styles.statsCard}>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>PLAYERS ONLINE</span>
                        <span className={styles.statValue}>
                            {serverStats.players_online}
                            <span className={styles.statTotal}>/{serverStats.max_players}</span>
                        </span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>RECORDS TODAY</span>
                        <span className={styles.statValueBlue}>
                            {(serverStats.records_today || 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'times' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('times')}
                    >
                        Recent Times
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'records' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('records')}
                    >
                        Recent Records
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Map</th>
                            <th>Player</th>
                            <th>Time</th>
                            <th>Jumps</th>
                            <th>Strafes</th>
                            <th>Sync</th>
                            <th>Points</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No records found.</td></tr>
                        ) : (
                            data.map((row, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className={styles.mapCell}>
                                            {/* Placeholder map image logic could go here */}
                                            <span className={styles.mapName}>{row.map}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.playerCell}>
                                            <div className={styles.avatarPlaceholder}>{row.name.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <Link to={`/player/${row.auth}`} className={styles.playerName}>
                                                    {row.name}
                                                </Link>
                                                <div className={styles.playerAuth}>{convertToSteamID2(row.auth)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.timeBadge}>{formatTime(row.time)}</span>
                                    </td>
                                    <td>{row.jumps || 0}</td>
                                    <td>{row.strafes || 0}</td>
                                    <td>{row.sync ? `${parseFloat(row.sync).toFixed(1)}%` : '0%'}</td>
                                    <td>{Math.round(row.points) || 0}</td>
                                    <td className={styles.dateCell}>
                                        {new Date(row.date * 1000).toLocaleDateString()} {new Date(row.date * 1000).toLocaleTimeString()}
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
