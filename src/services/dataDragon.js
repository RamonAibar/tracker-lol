import axios from 'axios'

const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com'

let cachedVersion = null
let championsData = null

export default {
  // Get latest game version
  async getVersion() {
    if (cachedVersion) return cachedVersion
    const res = await axios.get(`${DDRAGON_BASE}/api/versions.json`)
    cachedVersion = res.data[0]
    return cachedVersion
  },

  // Get all champions data
  async getChampions() {
    if (championsData) return championsData
    const version = await this.getVersion()
    const res = await axios.get(`${DDRAGON_BASE}/cdn/${version}/data/en_US/champion.json`)
    championsData = res.data.data
    return championsData
  },

  // Get champion name by key (numeric ID)
  async getChampionById(championId) {
    const champions = await this.getChampions()
    for (const [name, data] of Object.entries(champions)) {
      if (parseInt(data.key) === championId) return data
    }
    return null
  },

  // Get champion square image URL
  async getChampionImage(championName) {
    const version = await this.getVersion()
    return `${DDRAGON_BASE}/cdn/${version}/img/champion/${championName}.png`
  },

  // Get champion splash image URL
  getChampionSplash(championId, skinNum = 0) {
    return `${DDRAGON_BASE}/cdn/img/champion/splash/${championId}_${skinNum}.jpg`
  },

  // Get champion loading image URL
  getChampionLoading(championId, skinNum = 0) {
    return `${DDRAGON_BASE}/cdn/img/champion/loading/${championId}_${skinNum}.jpg`
  },

  // Get profile icon URL
  async getProfileIcon(iconId) {
    const version = await this.getVersion()
    return `${DDRAGON_BASE}/cdn/${version}/img/profileicon/${iconId}.png`
  },

  // Get item image URL
  async getItemImage(itemId) {
    const version = await this.getVersion()
    return `${DDRAGON_BASE}/cdn/${version}/img/item/${itemId}.png`
  },

  // Get summoner spell image URL
  async getSpellImage(spellName) {
    const version = await this.getVersion()
    return `${DDRAGON_BASE}/cdn/${version}/img/spell/${spellName}.png`
  },

  // Get rank emblem image
  getRankEmblem(tier) {
    const t = tier?.toLowerCase()
    const ext = t === 'emerald' ? 'svg' : 'png'
    return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${t}.${ext}`
  },

  // Summoner spell ID to name mapping
  getSummonerSpellName(id) {
    const spells = {
      1: 'SummonerBoost', 3: 'SummonerExhaust', 4: 'SummonerFlash',
      6: 'SummonerHaste', 7: 'SummonerHeal', 11: 'SummonerSmite',
      12: 'SummonerTeleport', 13: 'SummonerMana', 14: 'SummonerDot',
      21: 'SummonerBarrier', 30: 'SummonerPoroRecall', 31: 'SummonerPoroThrow',
      32: 'SummonerSnowball', 39: 'SummonerSnowURFSnowball_Mark',
      54: 'Summoner_UltBookPlaceholder', 55: 'Summoner_UltBookSmitePlaceholder',
    }
    return spells[id] || 'SummonerFlash'
  },

  // Queue ID to name mapping
  getQueueName(queueId) {
    const queues = {
      400: 'Normal Draft', 420: 'Ranked Solo/Duo', 430: 'Normal Blind',
      440: 'Ranked Flex', 450: 'ARAM', 700: 'Clash', 830: 'Co-op vs AI (Intro)',
      840: 'Co-op vs AI (Beginner)', 850: 'Co-op vs AI (Intermediate)',
      900: 'ARURF', 1020: 'One for All', 1300: 'Nexus Blitz',
      1400: 'Ultimate Spellbook', 1700: 'Arena', 1900: 'Pick URF',
    }
    return queues[queueId] || 'Custom'
  },
}
