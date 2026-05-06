<template>
  <div class="search-page">
    <!-- Search Section -->
    <section class="search-section container">
      <div class="search-header" v-if="!summoner && !loading">
        <h1 class="font-heading">Cerca <span class="text-gold">Invocador</span></h1>
        <p class="search-desc">Introdueix un Riot ID per veure estadístiques completes</p>
      </div>
      <div class="search-bar-wrapper" :class="{ 'search-bar-compact': summoner }">
        <SearchBar ref="searchBarRef" :initial-region="currentRegion" />
      </div>
    </section>

    <!-- Loading State -->
    <section v-if="loading" class="loading-section container">
      <div class="loading-content">
        <div class="loading-animation">
          <div class="spinner"></div>
          <div class="loading-ring"></div>
        </div>
        <p class="loading-text">Carregant dades de l'invocador...</p>
        <p class="loading-sub">Connectant amb les APIs de Riot Games</p>
      </div>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-section container">
      <div class="error-card card">
        <div class="error-icon">😔</div>
        <h3>Invocador no trobat</h3>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="$router.push('/search')">Torna a cercar</button>
      </div>
    </section>

    <!-- Summoner Profile -->
    <section v-else-if="summoner" class="profile-section container">
      <!-- Profile Header -->
      <div class="profile-header animate-fade-in-up">
        <div class="profile-banner">
          <div class="profile-banner-overlay"></div>
        </div>
        <div class="profile-main">
          <div class="profile-icon-wrapper">
            <img :src="profileIconUrl" :alt="accountData.gameName" class="profile-icon" />
            <div class="profile-level">{{ summoner.summonerLevel }}</div>
          </div>
          <div class="profile-info">
            <h1 class="profile-name">
              {{ accountData.gameName }}<span class="profile-tag">#{{ accountData.tagLine }}</span>
            </h1>
            <div class="profile-meta">
              <span class="profile-region-badge">
                <svg viewBox="0 0 20 20" fill="currentColor" class="region-icon"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
                {{ regionDisplay }}
              </span>
              <span class="profile-update">Últim update: {{ lastUpdate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <!-- Sidebar -->
        <div class="sidebar animate-fade-in-up" style="animation-delay: 0.1s;">
          <!-- Rank Cards -->
          <div class="sidebar-section">
            <h2 class="section-label">
              <svg viewBox="0 0 20 20" fill="currentColor" class="label-icon"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              Rang Competitiu
            </h2>
            <div class="ranks-list">
              <RankCard v-for="entry in leagueEntries" :key="entry.queueType" :entry="entry" />
              <div v-if="leagueEntries.length === 0" class="unranked-card card">
                <div class="unranked-icon">🎮</div>
                <p>Sense classificació</p>
                <span>Juga classificatòries per obtenir un rang</span>
              </div>
            </div>
          </div>

          <!-- Champion Mastery -->
          <div class="sidebar-section">
            <h2 class="section-label">
              <svg viewBox="0 0 20 20" fill="currentColor" class="label-icon"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/></svg>
              Campions Favorits
            </h2>
            <div class="mastery-list">
              <MasteryCard v-for="m in masteryData" :key="m.championId" :mastery="m" />
              <p v-if="masteryData.length === 0" class="no-data">Sense dades de maestria</p>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="main-content animate-fade-in-up" style="animation-delay: 0.2s;">
          <div class="matches-header">
            <h2 class="section-label">
              <svg viewBox="0 0 20 20" fill="currentColor" class="label-icon"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
              Historial de Partides
            </h2>
            <div class="match-filters">
              <button
                v-for="filter in matchFilters"
                :key="filter.value"
                class="filter-btn"
                :class="{ active: activeFilter === filter.value }"
                @click="changeFilter(filter.value)"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>

          <!-- Match Stats Summary -->
          <div v-if="matchDetails.length > 0" class="match-summary glass">
            <div class="summary-main">
              <div class="summary-chart">
                <svg viewBox="0 0 36 36" class="donut-chart">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--loss)" stroke-width="3" opacity="0.3"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--win)" stroke-width="3"
                    :stroke-dasharray="`${overallWinrate} ${100 - overallWinrate}`" stroke-dashoffset="25"
                    stroke-linecap="round" class="donut-segment"/>
                </svg>
                <div class="summary-chart-text">
                  <span class="chart-percent" :class="overallWinrateClass">{{ overallWinrate }}%</span>
                </div>
              </div>
              <div class="summary-record">
                <span class="record-total">{{ matchDetails.length }} Partides</span>
                <span class="record-detail"><span class="text-win">{{ totalWins }}V</span> · <span class="text-loss">{{ totalLosses }}D</span></span>
              </div>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-stats">
              <div class="summary-stat">
                <span class="summary-value text-blue">{{ avgKDA }}</span>
                <span class="summary-label">KDA Mitjà</span>
              </div>
              <div class="summary-stat">
                <span class="summary-value">{{ avgCS }}</span>
                <span class="summary-label">CS/min</span>
              </div>
              <div class="summary-stat">
                <span class="summary-value">{{ avgKP }}%</span>
                <span class="summary-label">Kill Part.</span>
              </div>
            </div>
          </div>

          <!-- Match List -->
          <div class="match-list">
            <div v-if="loadingMatches" class="loading-matches">
              <div class="spinner"></div>
              <p>Carregant partides...</p>
            </div>
            <MatchCard
              v-for="match in matchDetails"
              :key="match.metadata.matchId"
              :match="match"
              :puuid="accountData.puuid"
            />
            <div v-if="matchDetails.length === 0 && !loadingMatches" class="no-matches card">
              <p>Sense partides recents</p>
            </div>
            <button
              v-if="matchDetails.length > 0 && hasMoreMatches"
              class="load-more-btn"
              @click="loadMoreMatches"
              :disabled="loadingMore"
            >
              <span v-if="loadingMore" class="spinner" style="width:20px;height:20px;border-width:2px;"></span>
              {{ loadingMore ? 'Carregant...' : 'Carregar més partides' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import SearchBar from '../components/search/SearchBar.vue'
import RankCard from '../components/search/RankCard.vue'
import MatchCard from '../components/search/MatchCard.vue'
import MasteryCard from '../components/search/MasteryCard.vue'
import riotApi from '../services/riotApi'
import dataDragon from '../services/dataDragon'

const route = useRoute()
const searchBarRef = ref(null)

const loading = ref(false)
const loadingMatches = ref(false)
const loadingMore = ref(false)
const error = ref('')
const accountData = ref(null)
const summoner = ref(null)
const leagueEntries = ref([])
const masteryData = ref([])
const matchIds = ref([])
const matchDetails = ref([])
const profileIconUrl = ref('')
const activeFilter = ref(null)
const hasMoreMatches = ref(true)
const currentRegion = ref('euw1')

const matchFilters = [
  { label: 'Totes', value: null },
  { label: 'Ranked', value: 'ranked' },
  { label: 'Normal', value: 'normal' },
]

const regionDisplay = computed(() => {
  const map = { euw1: 'Europe West', na1: 'North America', eun1: 'Europe Nordic & East', kr: 'Korea', br1: 'Brazil', la1: 'Latin America North', la2: 'Latin America South', oc1: 'Oceania', tr1: 'Turkey', ru: 'Russia', jp1: 'Japan' }
  return map[currentRegion.value] || currentRegion.value
})

const lastUpdate = computed(() => {
  if (!summoner.value?.revisionDate) return '—'
  return new Date(summoner.value.revisionDate).toLocaleDateString('ca-ES', { day: 'numeric', month: 'short', year: 'numeric' })
})

const totalWins = computed(() => matchDetails.value.filter(m => m.info.participants.find(p => p.puuid === accountData.value?.puuid)?.win).length)
const totalLosses = computed(() => matchDetails.value.length - totalWins.value)
const overallWinrate = computed(() => matchDetails.value.length === 0 ? 0 : Math.round((totalWins.value / matchDetails.value.length) * 100))
const overallWinrateClass = computed(() => overallWinrate.value >= 55 ? 'text-win' : overallWinrate.value <= 45 ? 'text-loss' : '')

const avgKDA = computed(() => {
  if (!matchDetails.value.length) return '0.00'
  let k = 0, d = 0, a = 0
  matchDetails.value.forEach(m => {
    const p = m.info.participants.find(p => p.puuid === accountData.value?.puuid)
    if (p) { k += p.kills; d += p.deaths; a += p.assists }
  })
  return ((k + a) / (d || 1)).toFixed(2)
})

const avgCS = computed(() => {
  if (!matchDetails.value.length) return '0.0'
  let totalCS = 0, totalMins = 0
  matchDetails.value.forEach(m => {
    const p = m.info.participants.find(p => p.puuid === accountData.value?.puuid)
    if (p) {
      totalCS += p.totalMinionsKilled + (p.neutralMinionsKilled || 0)
      totalMins += m.info.gameDuration / 60
    }
  })
  return (totalCS / (totalMins || 1)).toFixed(1)
})

const avgKP = computed(() => {
  if (!matchDetails.value.length) return '0'
  let total = 0
  matchDetails.value.forEach(m => {
    const p = m.info.participants.find(p => p.puuid === accountData.value?.puuid)
    if (p) {
      const teamKills = m.info.participants.filter(pp => pp.teamId === p.teamId).reduce((s, pp) => s + pp.kills, 0)
      if (teamKills > 0) total += ((p.kills + p.assists) / teamKills) * 100
    }
  })
  return Math.round(total / matchDetails.value.length)
})

async function fetchSummoner(region, gameName, tagLine) {
  loading.value = true
  error.value = ''
  summoner.value = null
  matchDetails.value = []
  currentRegion.value = region

  try {
    accountData.value = await riotApi.getAccount(region, gameName, tagLine)
    summoner.value = await riotApi.getSummoner(region, accountData.value.puuid)
    profileIconUrl.value = await dataDragon.getProfileIcon(summoner.value.profileIconId)
    leagueEntries.value = await riotApi.getLeague(region, accountData.value.puuid)
    masteryData.value = await riotApi.getMastery(region, accountData.value.puuid, 7)

    // Save to search history
    if (searchBarRef.value) {
      searchBarRef.value.addToHistory({
        region,
        gameName: accountData.value.gameName,
        tagLine: accountData.value.tagLine,
        iconUrl: profileIconUrl.value,
        level: summoner.value.summonerLevel,
      })
    }

    await fetchMatches()
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.error || 'No s\'ha pogut trobar l\'invocador. Verifica el Riot ID i la regió.'
  } finally {
    loading.value = false
  }
}

async function fetchMatches() {
  loadingMatches.value = true
  try {
    matchIds.value = await riotApi.getMatchIds(currentRegion.value, accountData.value.puuid, 0, 10, activeFilter.value)
    const details = await Promise.all(matchIds.value.map(id => riotApi.getMatch(currentRegion.value, id)))
    matchDetails.value = details
    hasMoreMatches.value = matchIds.value.length === 10
  } catch (err) { console.error('Error loading matches:', err) }
  finally { loadingMatches.value = false }
}

async function loadMoreMatches() {
  loadingMore.value = true
  try {
    const newIds = await riotApi.getMatchIds(currentRegion.value, accountData.value.puuid, matchDetails.value.length, 10, activeFilter.value)
    const newDetails = await Promise.all(newIds.map(id => riotApi.getMatch(currentRegion.value, id)))
    matchDetails.value.push(...newDetails)
    hasMoreMatches.value = newIds.length === 10
  } catch (err) { console.error('Error loading more:', err) }
  finally { loadingMore.value = false }
}

function changeFilter(filter) {
  activeFilter.value = filter
  if (accountData.value) { matchDetails.value = []; fetchMatches() }
}

watch(() => route.params, (params) => {
  if (params.gameName && params.tagLine && params.region) {
    fetchSummoner(params.region, params.gameName, params.tagLine)
  }
}, { immediate: true })
</script>

<style scoped>
.search-page { padding-bottom: var(--space-3xl); }

.search-section { padding: var(--space-2xl) var(--space-md); text-align: center; }
.search-header { margin-bottom: var(--space-xl); }
.search-header h1 { font-size: 2.5rem; margin-bottom: var(--space-sm); }
.search-desc { color: var(--text-secondary); font-size: 1.05rem; }
.search-bar-wrapper { display: flex; justify-content: center; }
.search-bar-compact { padding-top: 0; }

/* Loading */
.loading-section { padding: var(--space-3xl); text-align: center; }
.loading-content { display: flex; flex-direction: column; align-items: center; gap: var(--space-md); }
.loading-animation { position: relative; }
.loading-ring { position: absolute; inset: -8px; border: 2px solid transparent; border-top-color: var(--accent-blue); border-radius: 50%; animation: spin 1.5s linear infinite reverse; }
.loading-text { color: var(--text-primary); font-weight: 600; }
.loading-sub { color: var(--text-muted); font-size: 0.85rem; }

/* Error */
.error-section { padding: var(--space-2xl); }
.error-card { max-width: 420px; margin: 0 auto; text-align: center; padding: var(--space-2xl); display: flex; flex-direction: column; align-items: center; gap: var(--space-md); }
.error-icon { font-size: 3rem; }
.error-card h3 { color: var(--loss); font-size: 1.2rem; }
.error-card p { color: var(--text-secondary); font-size: 0.9rem; }
.retry-btn { padding: var(--space-sm) var(--space-xl); background: var(--bg-tertiary); color: var(--text-primary); border-radius: var(--radius-sm); font-weight: 600; transition: all var(--transition-fast); margin-top: var(--space-sm); }
.retry-btn:hover { background: var(--bg-hover); }

/* Profile Header */
.profile-header { position: relative; margin-bottom: var(--space-xl); border-radius: var(--radius-lg); overflow: hidden; }
.profile-banner { height: 120px; background: linear-gradient(135deg, rgba(200,155,60,0.15), rgba(10,200,185,0.1), rgba(155,89,182,0.1)); position: relative; }
.profile-banner-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent, var(--bg-primary)); }
.profile-main { display: flex; align-items: flex-end; gap: var(--space-xl); padding: 0 var(--space-xl) var(--space-lg); margin-top: -50px; position: relative; z-index: 1; }

.profile-icon-wrapper { position: relative; flex-shrink: 0; }
.profile-icon { width: 100px; height: 100px; border-radius: var(--radius-md); border: 4px solid var(--bg-primary); box-shadow: 0 0 0 2px var(--accent-gold), var(--shadow-glow-gold); }
.profile-level { position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, var(--accent-gold), #daa520); color: var(--bg-primary); font-size: 0.75rem; font-weight: 800; padding: 2px 12px; border-radius: 100px; box-shadow: var(--shadow-sm); }

.profile-info { padding-bottom: var(--space-sm); }
.profile-name { font-size: 2rem; font-weight: 800; line-height: 1.2; }
.profile-tag { color: var(--text-muted); font-weight: 400; font-size: 1.2rem; }
.profile-meta { display: flex; gap: var(--space-md); margin-top: var(--space-xs); align-items: center; }
.profile-region-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; color: var(--accent-blue); font-weight: 500; }
.region-icon { width: 14px; height: 14px; }
.profile-update { font-size: 0.75rem; color: var(--text-muted); }

/* Stats Grid */
.stats-grid { display: grid; grid-template-columns: 340px 1fr; gap: var(--space-xl); }

.section-label { display: flex; align-items: center; gap: var(--space-sm); font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--space-md); }
.label-icon { width: 16px; height: 16px; color: var(--accent-gold); }

.sidebar-section { margin-bottom: var(--space-xl); }
.ranks-list { display: flex; flex-direction: column; gap: var(--space-md); }
.unranked-card { padding: var(--space-xl); text-align: center; display: flex; flex-direction: column; align-items: center; gap: var(--space-sm); }
.unranked-icon { font-size: 2rem; }
.unranked-card p { font-weight: 600; }
.unranked-card span { font-size: 0.8rem; color: var(--text-muted); }
.mastery-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.no-data { color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: var(--space-lg); }

/* Matches */
.matches-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); flex-wrap: wrap; gap: var(--space-sm); }
.match-filters { display: flex; gap: var(--space-xs); }
.filter-btn { padding: var(--space-sm) var(--space-md); background: var(--bg-tertiary); color: var(--text-secondary); border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 500; transition: all var(--transition-fast); }
.filter-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
.filter-btn.active { background: rgba(200, 155, 60, 0.2); color: var(--accent-gold); }

/* Match Summary */
.match-summary { display: flex; align-items: center; padding: var(--space-lg); margin-bottom: var(--space-md); border-radius: var(--radius-md); gap: var(--space-lg); }
.summary-main { display: flex; align-items: center; gap: var(--space-md); }
.summary-chart { position: relative; width: 60px; height: 60px; }
.donut-chart { transform: rotate(-90deg); }
.donut-segment { transition: stroke-dasharray 1s ease; }
.summary-chart-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.chart-percent { font-size: 0.85rem; font-weight: 800; }
.summary-record { display: flex; flex-direction: column; gap: 2px; }
.record-total { font-size: 0.9rem; font-weight: 700; }
.record-detail { font-size: 0.8rem; }
.summary-divider { width: 1px; height: 40px; background: var(--border-color); }
.summary-stats { display: flex; gap: var(--space-xl); }
.summary-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.summary-value { font-size: 1.1rem; font-weight: 700; }
.summary-label { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.text-win { color: var(--win); }
.text-loss { color: var(--loss); }
.text-blue { color: var(--accent-blue); }

.match-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.loading-matches { display: flex; flex-direction: column; align-items: center; gap: var(--space-md); padding: var(--space-2xl); color: var(--text-secondary); }
.no-matches { padding: var(--space-2xl); text-align: center; color: var(--text-muted); }
.load-more-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: var(--space-sm); padding: var(--space-md); background: var(--bg-tertiary); color: var(--text-secondary); border-radius: var(--radius-md); font-weight: 600; transition: all var(--transition-fast); margin-top: var(--space-sm); }
.load-more-btn:hover:not(:disabled) { background: var(--bg-hover); color: var(--text-primary); }
.load-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }

@media (max-width: 1024px) { .stats-grid { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .profile-main { flex-direction: column; align-items: center; text-align: center; gap: var(--space-md); }
  .profile-name { font-size: 1.5rem; }
  .profile-meta { justify-content: center; }
  .search-header h1 { font-size: 1.8rem; }
  .match-summary { flex-direction: column; gap: var(--space-md); }
  .summary-divider { width: 100%; height: 1px; }
  .matches-header { flex-direction: column; align-items: stretch; }
  .match-filters { justify-content: center; }
}
</style>
