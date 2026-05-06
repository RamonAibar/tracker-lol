const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.RIOT_API_KEY;

if (!API_KEY) {
  console.error('❌ ERROR: RIOT_API_KEY no trobada! Revisa server/.env');
  process.exit(1);
}
console.log('✅ API Key carregada:', API_KEY.substring(0, 10) + '...');

// Regions mapping
const PLATFORM_ROUTES = {
  euw1: 'euw1.api.riotgames.com',
  na1: 'na1.api.riotgames.com',
  kr: 'kr.api.riotgames.com',
  eun1: 'eun1.api.riotgames.com',
  br1: 'br1.api.riotgames.com',
  la1: 'la1.api.riotgames.com',
  la2: 'la2.api.riotgames.com',
  oc1: 'oc1.api.riotgames.com',
  tr1: 'tr1.api.riotgames.com',
  ru: 'ru.api.riotgames.com',
  jp1: 'jp1.api.riotgames.com',
  ph2: 'ph2.api.riotgames.com',
  sg2: 'sg2.api.riotgames.com',
  th2: 'th2.api.riotgames.com',
  tw2: 'tw2.api.riotgames.com',
  vn2: 'vn2.api.riotgames.com',
};

const REGIONAL_ROUTES = {
  euw1: 'europe.api.riotgames.com',
  eun1: 'europe.api.riotgames.com',
  tr1: 'europe.api.riotgames.com',
  ru: 'europe.api.riotgames.com',
  na1: 'americas.api.riotgames.com',
  br1: 'americas.api.riotgames.com',
  la1: 'americas.api.riotgames.com',
  la2: 'americas.api.riotgames.com',
  kr: 'asia.api.riotgames.com',
  jp1: 'asia.api.riotgames.com',
  oc1: 'sea.api.riotgames.com',
  ph2: 'sea.api.riotgames.com',
  sg2: 'sea.api.riotgames.com',
  th2: 'sea.api.riotgames.com',
  tw2: 'sea.api.riotgames.com',
  vn2: 'sea.api.riotgames.com',
};

app.use(cors());
app.use(express.json());

// Helper function for Riot API calls
async function riotRequest(baseUrl, endpoint) {
  try {
    const response = await axios.get(`https://${baseUrl}${endpoint}`, {
      headers: { 'X-Riot-Token': API_KEY },
    });
    return response.data;
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.status?.message || 'Riot API error';
    throw { status, message };
  }
}

// GET account by Riot ID (gameName#tagLine)
app.get('/api/account/:region/:gameName/:tagLine', async (req, res) => {
  try {
    const { region, gameName, tagLine } = req.params;
    const regionalHost = REGIONAL_ROUTES[region] || REGIONAL_ROUTES.euw1;
    const data = await riotRequest(
      regionalHost,
      `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// GET summoner by PUUID
app.get('/api/summoner/:region/:puuid', async (req, res) => {
  try {
    const { region, puuid } = req.params;
    const platformHost = PLATFORM_ROUTES[region] || PLATFORM_ROUTES.euw1;
    const data = await riotRequest(
      platformHost,
      `/lol/summoner/v4/summoners/by-puuid/${puuid}`
    );
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// GET league entries by PUUID
app.get('/api/league/:region/:puuid', async (req, res) => {
  try {
    const { region, puuid } = req.params;
    const platformHost = PLATFORM_ROUTES[region] || PLATFORM_ROUTES.euw1;
    const data = await riotRequest(
      platformHost,
      `/lol/league/v4/entries/by-puuid/${puuid}`
    );
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// GET match IDs by PUUID
app.get('/api/matches/:region/:puuid', async (req, res) => {
  try {
    const { region, puuid } = req.params;
    const regionalHost = REGIONAL_ROUTES[region] || REGIONAL_ROUTES.euw1;
    const { start = 0, count = 20, type } = req.query;
    let endpoint = `/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;
    if (type) endpoint += `&type=${type}`;
    const data = await riotRequest(regionalHost, endpoint);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// GET match details by match ID
app.get('/api/match/:region/:matchId', async (req, res) => {
  try {
    const { region, matchId } = req.params;
    const regionalHost = REGIONAL_ROUTES[region] || REGIONAL_ROUTES.euw1;
    const data = await riotRequest(
      regionalHost,
      `/lol/match/v5/matches/${matchId}`
    );
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// GET champion mastery by PUUID (top champions)
app.get('/api/mastery/:region/:puuid', async (req, res) => {
  try {
    const { region, puuid } = req.params;
    const platformHost = PLATFORM_ROUTES[region] || PLATFORM_ROUTES.euw1;
    const { count = 7 } = req.query;
    const data = await riotRequest(
      platformHost,
      `/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`
    );
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Serve frontend in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Catch-all: serve index.html for Vue Router (history mode)
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 LoL Tracker running on http://localhost:${PORT}`);
});
