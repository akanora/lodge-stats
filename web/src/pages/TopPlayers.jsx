import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useServer } from '../context/ServerContext';
import { fetchStats } from '../services/api';
import { Search } from 'lucide-react';
import styles from './Home.module.css'; // Reusing styles for consistent table

export default function TopPlayers() {
    const { serverTick } = useServer();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [rankingType, setRankingType] = useState('points');

    // Convert SteamID3 to SteamID2 format
    const convertToSteamID2 = (steamid3) => {
        if (!steamid3 || isNaN(steamid3)) return steamid3;

        const accountId = parseInt(steamid3);
        const y = accountId % 2;
        const z = Math.floor(accountId / 2);
        return `STEAM_0:${y}:${z} `;
    };

    // Format playtime (seconds to hours)
    const formatPlaytime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    useEffect(() => {
        setLoading(true);
        fetchStats('top', serverTick, { type: rankingType }).then(res => {
            setData(res);
            setLoading(false);
        });
    }, [serverTick, rankingType]);

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

    const displayData = searchQuery.length >= 3 ? searchResults : data;

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

            <div className={styles.controls}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${rankingType === 'points' ? styles.activeTab : ''}`}
                        onClick={() => setRankingType('points')}
                    >
                        Top Points
                    </button>
                    <button
                        className={`${styles.tab} ${rankingType === 'playtime' ? styles.activeTab : ''}`}
                        onClick={() => setRankingType('playtime')}
                    >
                        Top Playtime
                    </button>
                </div>

                <div className={styles.searchBar}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by Steam ID or Player Name..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '80px', textAlign: 'center' }}>#</th>
                            <th>Player</th>
                            <th>{rankingType === 'playtime' ? 'Playtime' : 'Points'}</th>
                            <th>Last Seen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isSearching ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Searching...</td></tr>
                        ) : loading ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                        ) : displayData.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No players found.</td></tr>
                        ) : (
                            displayData.map((row, i) => (
                                <tr key={i}>
                                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: i < 3 ? 'var(--color-primary)' : 'inherit' }}>
                                        {i + 1}
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
                                        {rankingType === 'playtime'
                                            ? formatPlaytime(row.playtime || 0)
                                            : `${(row.points || 0).toLocaleString()} pts`
                                        }
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
