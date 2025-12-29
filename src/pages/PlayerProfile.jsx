import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useServer } from '../context/ServerContext';
import { fetchStats } from '../services/api';
import { ArrowLeft, Trophy, Map, Clock, Filter } from 'lucide-react';
import styles from './PlayerProfile.module.css';

// Import styles and tracks from config
const STYLES = {
    0: 'Normal', 1: 'Sideways', 2: 'W-Only', 3: 'Scroll', 4: '400 Velocity',
    5: 'Half-Sideways', 6: 'A/D-Only', 7: 'Segmented', 8: 'Low Gravity', 9: 'Slow Motion',
    10: 'TAS', 11: 'Autostrafer', 12: 'Parkour', 13: 'Speedrun', 14: 'Slow Speedrun',
    15: 'Prespeed', 16: 'Seg Low Gravity', 17: 'Unreal', 18: 'Backwards', 19: 'Double Jump',
    20: 'Spiderman', 21: 'EzScroll', 22: 'Stamina', 23: 'KZ', 24: 'TASNL',
    25: 'Thanos', 26: 'Parachute', 27: 'Surf HSW', 28: 'Speed Demon'
};

const TRACKS = { 0: 'Main', 1: 'Bonus 1', 2: 'Bonus 2', 3: 'Bonus 3' };

export default function PlayerProfile() {
    const { steamid } = useParams();
    const navigate = useNavigate();
    const { serverTick } = useServer();
    const [playerData, setPlayerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterStyle, setFilterStyle] = useState(-1);
    const [filterTrack, setFilterTrack] = useState(-1);

    useEffect(() => {
        setLoading(true);
        const params = { steamid };
        if (filterStyle >= 0) params.style = filterStyle;
        if (filterTrack >= 0) params.track = filterTrack;

        fetchStats('player', serverTick, params)
            .then(data => {
                setPlayerData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch player data:', err);
                setLoading(false);
            });
    }, [steamid, serverTick, filterStyle, filterTrack]);

    if (loading) {
        return <div className={styles.loading}>Loading player profile...</div>;
    }

    if (!playerData || !playerData.player) {
        return (
            <div className={styles.error}>
                <h2>Player Not Found</h2>
                <button onClick={() => navigate('/')} className={styles.backBtn}>
                    <ArrowLeft size={16} /> Back to Home
                </button>
            </div>
        );
    }

    const { player, recent_times, maps_completed, world_records } = playerData;

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
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className={styles.container}>
            <button onClick={() => navigate(-1)} className={styles.backBtn}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className={styles.header}>
                {player.avatar && (
                    <img src={player.avatar} alt={player.name} className={styles.avatar} />
                )}
                <div className={styles.playerInfo}>
                    <h1>{player.name}</h1>
                    <p className={styles.steamid}>{convertToSteamID2(player.auth)}</p>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <Trophy className={styles.icon} />
                    <div className={styles.statValue}>{player.points.toLocaleString()}</div>
                    <div className={styles.statLabel}>Points</div>
                </div>
                <div className={styles.statCard}>
                    <Map className={styles.icon} />
                    <div className={styles.statValue}>{maps_completed}</div>
                    <div className={styles.statLabel}>Maps Completed</div>
                </div>
                <div className={styles.statCard}>
                    <Trophy className={styles.icon} style={{ color: '#ffd700' }} />
                    <div className={styles.statValue}>{world_records}</div>
                    <div className={styles.statLabel}>World Records</div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2><Clock size={20} /> Recent Times</h2>
                    <div className={styles.filters}>
                        <Filter size={16} />
                        <select value={filterStyle} onChange={(e) => setFilterStyle(parseInt(e.target.value))} className={styles.filterSelect}>
                            <option value="-1">All Styles</option>
                            {Object.entries(STYLES).map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                        <select value={filterTrack} onChange={(e) => setFilterTrack(parseInt(e.target.value))} className={styles.filterSelect}>
                            <option value="-1">All Tracks</option>
                            {Object.entries(TRACKS).map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Map</th>
                                <th>Time</th>
                                <th>Style</th>
                                <th>Track</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent_times.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No times found</td></tr>
                            ) : (
                                recent_times.map((time, idx) => (
                                    <tr key={idx}>
                                        <td>{time.map}</td>
                                        <td className={styles.time}>{formatTime(time.time)}</td>
                                        <td>{STYLES[time.style] || `Style ${time.style}`}</td>
                                        <td>{TRACKS[time.track] || `Bonus ${time.track}`}</td>
                                        <td>{formatDate(time.date)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
