export const MOCK_RECENT_TIMES = [
    { map: "bhop_badges", name: "bhop_master", style: 0, time: 102.33, date: Date.now() / 1000 - 120, auth: "STEAM_0:1:482910" },
    { map: "bhop_lego2", name: "speed_demon", style: 0, time: 55.12, date: Date.now() / 1000 - 300, auth: "STEAM_0:0:119283" },
    { map: "bhop_arcane", name: "bunny_hopper", style: 1, time: 130.45, date: Date.now() / 1000 - 900, auth: "STEAM_0:1:554321" },
    { map: "bhop_colors", name: "air_strafer", style: 0, time: 192.89, date: Date.now() / 1000 - 1500, auth: "STEAM_0:1:123123" },
    { map: "bhop_moments", name: "kz_legend", style: 2, time: 245.11, date: Date.now() / 1000 - 3600, auth: "STEAM_0:0:987654" },
];

export const MOCK_TOP_PLAYERS = [
    { name: "bhop_master", points: 25000, lastlogin: Date.now() / 1000 - 86400, auth: "STEAM_0:1:482910" },
    { name: "strafe_god", points: 24500, lastlogin: Date.now() / 1000 - 4000, auth: "STEAM_0:1:992834" },
    { name: "jump_king", points: 22100, lastlogin: Date.now() / 1000 - 100000, auth: "STEAM_0:0:777888" },
    { name: "speedy", points: 19500, lastlogin: Date.now() / 1000 - 500, auth: "STEAM_0:1:111222" },
    { name: "momentum", points: 18000, lastlogin: Date.now() / 1000 - 200000, auth: "STEAM_0:0:333444" },
];

export const MOCK_STATS = {
    players_online: 0,
    max_players: 256,
    records_today: 0
};

export const API_URL = '/stats/api/index.php'; // Absolute path from domain root

export async function fetchStats(endpoint, server = '100', params = {}) {
    try {
        // Build query string
        const queryParams = new URLSearchParams({
            endpoint,
            server,
            ...params
        });

        const url = `${API_URL}?${queryParams.toString()}`;
        const res = await fetch(url);
        const json = await res.json();

        if (json.status === 'success') {
            return json.data;
        } else {
            console.warn("API Error (using mock):", json.message);
            throw new Error(json.message);
        }
    } catch (err) {
        console.log("Fetch failed, returning mock data for:", endpoint);
        // Return Mock Data on failure (Dev mode or DB down)
        if (endpoint === 'recent') return MOCK_RECENT_TIMES;
        if (endpoint === 'top') return MOCK_TOP_PLAYERS;
        if (endpoint === 'stats') return MOCK_STATS;
        return [];
    }
}
