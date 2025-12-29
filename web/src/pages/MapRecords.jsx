import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useServer } from '../context/ServerContext';
import { fetchStats } from '../services/api';
import { ArrowLeft, Search } from 'lucide-react';
import styles from './MapRecords.module.css';

const STYLES = {
    0: 'Normal', 1: 'Sideways', 2: 'W-Only', 3: 'Scroll', 4: '400 Velocity',
    5: 'Half-Sideways', 6: 'A/D-Only', 7: 'Segmented', 8: 'Low Gravity', 9: 'Slow Motion',
    10: 'TAS', 11: 'Autostrafer', 12: 'Parkour', 13: 'Speedrun', 14: 'Slow Speedrun',
    15: 'Prespeed', 16: 'Seg Low Gravity', 17: 'Unreal', 18: 'Backwards', 19: 'Double Jump',
    20: 'Spiderman', 21: 'EzScroll', 22: 'Stamina', 23: 'KZ', 24: 'TASNL',
    25: 'Thanos', 26: 'Parachute', 27: 'Surf HSW', 28: 'Speed Demon'
};

const TRACKS = { 0: 'Main', 1: 'Bonus 1', 2: 'Bonus 2', 3: 'Bonus 3' };

export default function MapRecords() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { serverTick } = useServer();
    const [mapName, setMapName] = useState(searchParams.get('map') || '');
    const [searchInput, setSearchInput] = useState(searchParams.get('map') || '');
    const [records, setRecords] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState(0);
    const [selectedTrack, setSelectedTrack] = useState(0);

    const convertToSteamID2 = (steamid3) => {
        if (!steamid3 || isNaN(steamid3)) return steamid3;
        const accountId = parseInt(steamid3);
        const y = accountId % 2;
        const z = Math.floor(accountId / 2);
        return `STEAM_0:${y}:${z}`;
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = (seconds % 60).toFixed(3);
        return mins > 0 ? `${mins}:${secs.padStart(6, '0')}` : `${secs}s`;
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setMapName(searchInput.trim());
            navigate(`/map?map=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    useEffect(() => {
        if (mapName) {
            setLoading(true);
            fetchStats('map', serverTick, { map: mapName })
                .then(data => {
                    setRecords(data.records || {});
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch map records:', err);
                    setLoading(false);
                });
        }
    }, [mapName, serverTick]);

    const currentRecords = records[`${selectedStyle}_${selectedTrack}`] || [];

    return (
        <div className={styles.container}>
            <button onClick={() => navigate('/')} className={styles.backBtn}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className={styles.header}>
                <h1>Map Records</h1>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Enter map name (e.g., bhop_cyberspace)..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button type="submit" className={styles.searchBtn}>Search</button>
                </form>
            </div>

            {mapName && (
                <>
                    <div className={styles.mapTitle}>
                        <h2>{mapName}</h2>
                    </div>

                    <div className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <label>Style:</label>
                            <select value={selectedStyle} onChange={(e) => setSelectedStyle(parseInt(e.target.value))} className={styles.select}>
                                {Object.entries(STYLES).map(([id, name]) => (
                                    <option key={id} value={id}>{name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <label>Track:</label>
                            <select value={selectedTrack} onChange={(e) => setSelectedTrack(parseInt(e.target.value))} className={styles.select}>
                                {Object.entries(TRACKS).map(([id, name]) => (
                                    <option key={id} value={id}>{name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3>{STYLES[selectedStyle]} - {TRACKS[selectedTrack]}</h3>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Player</th>
                                        <th>Time</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                                    ) : currentRecords.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No records found</td></tr>
                                    ) : (
                                        currentRecords.map((record, idx) => (
                                            <tr key={idx}>
                                                <td className={styles.rank}>#{record.rank}</td>
                                                <td>
                                                    <Link to={`/player/${record.auth}`} className={styles.playerLink}>
                                                        {record.name}
                                                    </Link>
                                                    <div className={styles.steamid}>{convertToSteamID2(record.auth)}</div>
                                                </td>
                                                <td className={styles.time}>{formatTime(record.time)}</td>
                                                <td>{formatDate(record.date)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
