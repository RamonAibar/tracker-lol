import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
})

export default {
  // Get account by Riot ID
  async getAccount(region, gameName, tagLine) {
    const res = await api.get(`/account/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`)
    return res.data
  },

  // Get summoner by PUUID
  async getSummoner(region, puuid) {
    const res = await api.get(`/summoner/${region}/${puuid}`)
    return res.data
  },

  // Get league entries
  async getLeague(region, summonerId) {
    const res = await api.get(`/league/${region}/${summonerId}`)
    return res.data
  },

  // Get match IDs
  async getMatchIds(region, puuid, start = 0, count = 10, type = null) {
    let url = `/matches/${region}/${puuid}?start=${start}&count=${count}`
    if (type) url += `&type=${type}`
    const res = await api.get(url)
    return res.data
  },

  // Get match details
  async getMatch(region, matchId) {
    const res = await api.get(`/match/${region}/${matchId}`)
    return res.data
  },

  // Get champion mastery
  async getMastery(region, puuid, count = 7) {
    const res = await api.get(`/mastery/${region}/${puuid}?count=${count}`)
    return res.data
  },
}
