<template>
  <div class="match-card card" :class="{ win: isWin, loss: !isWin && !isRemake, remake: isRemake, expanded: isExpanded }">
    <!-- Main Row (always visible) -->
    <div class="match-main" @click="isExpanded = !isExpanded">
      <div class="match-result">
        <span class="result-text">{{ resultText }}</span>
        <span class="match-queue">{{ queueName }}</span>
        <span class="match-time">{{ timeAgo }}</span>
        <span class="match-duration">{{ duration }}</span>
      </div>

      <div class="match-champion">
        <div class="champ-img-wrapper">
          <img :src="championImg" :alt="championName" class="champ-img" loading="lazy" />
          <span class="champ-level">{{ player.champLevel }}</span>
        </div>
        <div class="summoner-spells">
          <img :src="spell1Img" alt="spell1" class="spell-img" loading="lazy" />
          <img :src="spell2Img" alt="spell2" class="spell-img" loading="lazy" />
        </div>
      </div>

      <div class="match-kda">
        <div class="kda-numbers">
          <span class="kills">{{ player.kills }}</span>
          <span class="separator">/</span>
          <span class="deaths">{{ player.deaths }}</span>
          <span class="separator">/</span>
          <span class="assists">{{ player.assists }}</span>
        </div>
        <div class="kda-ratio" :class="kdaClass">{{ kdaRatio }} KDA</div>
        <div class="kda-participation">P/Kill {{ killParticipation }}%</div>
      </div>

      <div class="match-stats hide-mobile">
        <div class="stat">
          <span class="stat-value">{{ totalCS }}</span>
          <span class="stat-label">{{ csPerMin }}/min</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ player.visionScore }}</span>
          <span class="stat-label">Visió</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ formatGold(player.goldEarned) }}</span>
          <span class="stat-label">Or</span>
        </div>
      </div>

      <div class="match-items hide-mobile">
        <div class="items-grid">
          <div v-for="itemId in items" :key="itemId.index" class="item-slot">
            <img v-if="itemId.src" :src="itemId.src" :alt="'item'" class="item-img" loading="lazy" @error="e => e.target.style.visibility='hidden'" />
          </div>
        </div>
      </div>

      <div class="match-players-preview hide-mobile">
        <div class="team-preview">
          <div v-for="p in team1Preview" :key="p.puuid" class="player-preview" :class="{ 'is-me': p.puuid === puuid }">
            <img :src="p.champImg" :alt="p.riotIdGameName" class="preview-champ" loading="lazy" />
            <span class="preview-name" :title="p.riotIdGameName">{{ truncName(p.riotIdGameName) }}</span>
          </div>
        </div>
        <div class="team-preview">
          <div v-for="p in team2Preview" :key="p.puuid" class="player-preview" :class="{ 'is-me': p.puuid === puuid }">
            <img :src="p.champImg" :alt="p.riotIdGameName" class="preview-champ" loading="lazy" />
            <span class="preview-name" :title="p.riotIdGameName">{{ truncName(p.riotIdGameName) }}</span>
          </div>
        </div>
      </div>

      <button class="expand-btn" :class="{ rotated: isExpanded }">
        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
      </button>
    </div>

    <!-- Expanded Section: All 10 players -->
    <transition name="expand">
      <div v-if="isExpanded" class="match-expanded">
        <!-- Team 1 -->
        <div class="team-section">
          <div class="team-header" :class="team1Won ? 'team-win' : 'team-loss'">
            <span>{{ team1Won ? '🏆 Victòria' : '💀 Derrota' }}</span>
            <span class="team-side">Equip Blau</span>
          </div>
          <div class="team-players">
            <div v-for="p in team1Details" :key="p.puuid" class="team-player" :class="{ 'is-me': p.puuid === puuid }">
              <div class="tp-champ">
                <img :src="p.champImg" :alt="p.championName" class="tp-champ-img" loading="lazy" />
                <span class="tp-level">{{ p.champLevel }}</span>
              </div>
              <div class="tp-spells">
                <img :src="p.spell1Img" class="tp-spell" loading="lazy" />
                <img :src="p.spell2Img" class="tp-spell" loading="lazy" />
              </div>
              <div class="tp-info">
                <span class="tp-name" :class="{ 'tp-name-me': p.puuid === puuid }">{{ p.riotIdGameName || 'Unknown' }}</span>
                <span class="tp-tag">#{{ p.riotIdTagline || '???' }}</span>
              </div>
              <div class="tp-kda">
                <span class="tp-kda-nums">{{ p.kills }}/{{ p.deaths }}/{{ p.assists }}</span>
                <span class="tp-kda-ratio" :class="getKdaClass(p)">{{ getKda(p) }}</span>
              </div>
              <div class="tp-damage hide-mobile">
                <div class="damage-bar">
                  <div class="damage-fill" :style="{ width: getDmgWidth(p) + '%' }"></div>
                </div>
                <span class="tp-dmg-text">{{ formatNum(p.totalDamageDealtToChampions) }}</span>
              </div>
              <div class="tp-cs hide-mobile">
                <span>{{ p.totalMinionsKilled + (p.neutralMinionsKilled || 0) }} CS</span>
              </div>
              <div class="tp-gold hide-mobile">
                <span>{{ formatGold(p.goldEarned) }}</span>
              </div>
              <div class="tp-items">
                <img v-for="(item, idx) in getPlayerItems(p)" :key="idx" :src="item" class="tp-item" loading="lazy" @error="e => e.target.style.visibility='hidden'" />
              </div>
            </div>
          </div>
        </div>

        <!-- Team 2 -->
        <div class="team-section">
          <div class="team-header" :class="!team1Won ? 'team-win' : 'team-loss'">
            <span>{{ !team1Won ? '🏆 Victòria' : '💀 Derrota' }}</span>
            <span class="team-side">Equip Vermell</span>
          </div>
          <div class="team-players">
            <div v-for="p in team2Details" :key="p.puuid" class="team-player" :class="{ 'is-me': p.puuid === puuid }">
              <div class="tp-champ">
                <img :src="p.champImg" :alt="p.championName" class="tp-champ-img" loading="lazy" />
                <span class="tp-level">{{ p.champLevel }}</span>
              </div>
              <div class="tp-spells">
                <img :src="p.spell1Img" class="tp-spell" loading="lazy" />
                <img :src="p.spell2Img" class="tp-spell" loading="lazy" />
              </div>
              <div class="tp-info">
                <span class="tp-name" :class="{ 'tp-name-me': p.puuid === puuid }">{{ p.riotIdGameName || 'Unknown' }}</span>
                <span class="tp-tag">#{{ p.riotIdTagline || '???' }}</span>
              </div>
              <div class="tp-kda">
                <span class="tp-kda-nums">{{ p.kills }}/{{ p.deaths }}/{{ p.assists }}</span>
                <span class="tp-kda-ratio" :class="getKdaClass(p)">{{ getKda(p) }}</span>
              </div>
              <div class="tp-damage hide-mobile">
                <div class="damage-bar">
                  <div class="damage-fill damage-fill-red" :style="{ width: getDmgWidth(p) + '%' }"></div>
                </div>
                <span class="tp-dmg-text">{{ formatNum(p.totalDamageDealtToChampions) }}</span>
              </div>
              <div class="tp-cs hide-mobile">
                <span>{{ p.totalMinionsKilled + (p.neutralMinionsKilled || 0) }} CS</span>
              </div>
              <div class="tp-gold hide-mobile">
                <span>{{ formatGold(p.goldEarned) }}</span>
              </div>
              <div class="tp-items">
                <img v-for="(item, idx) in getPlayerItems(p)" :key="idx" :src="item" class="tp-item" loading="lazy" @error="e => e.target.style.visibility='hidden'" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dataDragon from '../../services/dataDragon'

const props = defineProps({
  match: { type: Object, required: true },
  puuid: { type: String, required: true },
})

const isExpanded = ref(false)
const championImg = ref('')
const championName = ref('')
const spell1Img = ref('')
const spell2Img = ref('')
const items = ref([])
const team1Preview = ref([])
const team2Preview = ref([])
const team1Details = ref([])
const team2Details = ref([])
const maxDmg = ref(1)
const version = ref('')

const player = computed(() => {
  return props.match.info.participants.find(p => p.puuid === props.puuid) || {}
})

const isWin = computed(() => player.value.win)
const isRemake = computed(() => props.match.info.gameDuration < 300)
const resultText = computed(() => isRemake.value ? 'Remake' : isWin.value ? 'Victòria' : 'Derrota')
const duration = computed(() => {
  const secs = props.match.info.gameDuration
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`
})
const queueName = computed(() => dataDragon.getQueueName(props.match.info.queueId))
const timeAgo = computed(() => {
  const diff = Date.now() - props.match.info.gameCreation
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Fa poc'
  if (hours < 24) return `Fa ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `Fa ${days}d`
  return `Fa ${Math.floor(days / 30)}m`
})

const totalCS = computed(() => player.value.totalMinionsKilled + (player.value.neutralMinionsKilled || 0))
const csPerMin = computed(() => (totalCS.value / (props.match.info.gameDuration / 60)).toFixed(1))

const kdaRatio = computed(() => {
  const d = player.value.deaths || 1
  return ((player.value.kills + player.value.assists) / d).toFixed(2)
})
const kdaClass = computed(() => {
  const r = parseFloat(kdaRatio.value)
  if (r >= 5) return 'legendary'
  if (r >= 3) return 'good'
  if (r >= 2) return 'average'
  return 'low'
})

const killParticipation = computed(() => {
  const myTeamId = player.value.teamId
  const teamKills = props.match.info.participants
    .filter(p => p.teamId === myTeamId)
    .reduce((sum, p) => sum + p.kills, 0)
  if (teamKills === 0) return 0
  return Math.round(((player.value.kills + player.value.assists) / teamKills) * 100)
})

const team1Won = computed(() => {
  const team = props.match.info.teams?.find(t => t.teamId === 100)
  return team?.win
})

function getKda(p) {
  const d = p.deaths || 1
  return ((p.kills + p.assists) / d).toFixed(1)
}
function getKdaClass(p) {
  const r = parseFloat(getKda(p))
  if (r >= 5) return 'legendary'
  if (r >= 3) return 'good'
  if (r >= 2) return 'average'
  return 'low'
}
function getDmgWidth(p) {
  return Math.round((p.totalDamageDealtToChampions / maxDmg.value) * 100)
}
function formatGold(g) {
  if (!g) return '0'
  if (g >= 1000) return (g / 1000).toFixed(1) + 'K'
  return g.toString()
}
function formatNum(n) {
  if (!n) return '0'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}
function truncName(name) {
  if (!name) return '?'
  return name.length > 8 ? name.substring(0, 7) + '…' : name
}

function getPlayerItems(p) {
  const ids = [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6]
  return ids.filter(id => id > 0).map(id => `https://ddragon.leagueoflegends.com/cdn/${version.value}/img/item/${id}.png`)
}

onMounted(async () => {
  const p = player.value
  version.value = await dataDragon.getVersion()

  // Main champion
  const champ = await dataDragon.getChampionById(p.championId)
  if (champ) {
    championName.value = champ.name
    championImg.value = await dataDragon.getChampionImage(champ.id)
  }

  // Spells
  spell1Img.value = await dataDragon.getSpellImage(dataDragon.getSummonerSpellName(p.summoner1Id))
  spell2Img.value = await dataDragon.getSpellImage(dataDragon.getSummonerSpellName(p.summoner2Id))

  // Items
  const itemIds = [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6]
  items.value = itemIds.map((id, index) => ({
    index,
    src: id > 0 ? `https://ddragon.leagueoflegends.com/cdn/${version.value}/img/item/${id}.png` : '',
  }))

  // Calculate max damage for bars
  maxDmg.value = Math.max(...props.match.info.participants.map(pp => pp.totalDamageDealtToChampions || 0), 1)

  // Team previews & details
  const allParticipants = props.match.info.participants
  const t1 = allParticipants.filter(pp => pp.teamId === 100)
  const t2 = allParticipants.filter(pp => pp.teamId === 200)

  const mapPlayer = async (pp) => {
    const ch = await dataDragon.getChampionById(pp.championId)
    return {
      ...pp,
      champImg: ch ? await dataDragon.getChampionImage(ch.id) : '',
      championName: ch?.name || '?',
      spell1Img: await dataDragon.getSpellImage(dataDragon.getSummonerSpellName(pp.summoner1Id)),
      spell2Img: await dataDragon.getSpellImage(dataDragon.getSummonerSpellName(pp.summoner2Id)),
    }
  }

  team1Preview.value = await Promise.all(t1.map(mapPlayer))
  team2Preview.value = await Promise.all(t2.map(mapPlayer))
  team1Details.value = team1Preview.value
  team2Details.value = team2Preview.value
})
</script>

<style scoped>
.match-card {
  border-left: 4px solid transparent;
  overflow: hidden;
  transition: all var(--transition-fast);
}
.match-card.win { border-left-color: var(--win); }
.match-card.loss { border-left-color: var(--loss); }
.match-card.remake { border-left-color: var(--remake); }

.match-main {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  cursor: pointer;
  transition: background var(--transition-fast);
}
.match-main:hover { background: var(--bg-hover); }

.match-card.win .match-main { background: linear-gradient(90deg, var(--win-bg), transparent 40%); }
.match-card.loss .match-main { background: linear-gradient(90deg, var(--loss-bg), transparent 40%); }

.match-result { min-width: 80px; display: flex; flex-direction: column; gap: 2px; }
.result-text { font-weight: 700; font-size: 0.85rem; }
.win .result-text { color: var(--win); }
.loss .result-text { color: var(--loss); }
.remake .result-text { color: var(--remake); }
.match-duration, .match-queue, .match-time { font-size: 0.72rem; color: var(--text-secondary); }
.match-queue { color: var(--text-muted); }

.match-champion { display: flex; align-items: center; gap: var(--space-xs); }
.champ-img-wrapper { position: relative; }
.champ-img { width: 48px; height: 48px; border-radius: var(--radius-sm); border: 2px solid var(--border-color); }
.champ-level { position: absolute; bottom: -2px; right: -2px; background: var(--bg-primary); color: var(--text-secondary); font-size: 0.6rem; font-weight: 700; padding: 0 3px; border-radius: 3px; border: 1px solid var(--border-color); }
.summoner-spells { display: flex; flex-direction: column; gap: 2px; }
.spell-img { width: 22px; height: 22px; border-radius: 4px; }

.match-kda { min-width: 90px; text-align: center; }
.kda-numbers { font-size: 1rem; font-weight: 700; }
.kills { color: var(--text-primary); }
.deaths { color: var(--loss); }
.assists { color: var(--text-secondary); }
.separator { color: var(--text-muted); margin: 0 1px; }
.kda-ratio { font-size: 0.72rem; font-weight: 600; margin-top: 1px; }
.kda-ratio.legendary { color: var(--accent-gold); }
.kda-ratio.good { color: var(--accent-blue); }
.kda-ratio.average { color: var(--text-primary); }
.kda-ratio.low { color: var(--text-secondary); }
.kda-participation { font-size: 0.65rem; color: var(--text-muted); }

.match-stats { display: flex; gap: var(--space-md); }
.stat { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.stat-value { font-size: 0.85rem; font-weight: 600; }
.stat-label { font-size: 0.65rem; color: var(--text-muted); }

.match-items { margin-left: auto; }
.items-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; }
.item-slot { width: 26px; height: 26px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; }
.item-img { width: 100%; height: 100%; object-fit: cover; }

.match-players-preview { display: flex; gap: var(--space-sm); margin-left: var(--space-sm); }
.team-preview { display: flex; flex-direction: column; gap: 2px; }
.player-preview { display: flex; align-items: center; gap: 3px; }
.player-preview.is-me .preview-name { color: var(--accent-gold); font-weight: 600; }
.preview-champ { width: 16px; height: 16px; border-radius: 3px; }
.preview-name { font-size: 0.6rem; color: var(--text-muted); max-width: 55px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.expand-btn { display: flex; align-items: center; padding: 4px; background: none; color: var(--text-muted); transition: transform var(--transition-fast); flex-shrink: 0; }
.expand-btn svg { width: 18px; height: 18px; }
.expand-btn.rotated { transform: rotate(180deg); }

/* Expanded section */
.match-expanded { border-top: 1px solid var(--border-color); }
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }
.expand-enter-to, .expand-leave-from { max-height: 2000px; opacity: 1; }

.team-section { border-bottom: 1px solid var(--border-color); }
.team-section:last-child { border-bottom: none; }
.team-header { display: flex; justify-content: space-between; align-items: center; padding: var(--space-sm) var(--space-lg); font-size: 0.8rem; font-weight: 700; }
.team-header.team-win { background: var(--win-bg); color: var(--win); }
.team-header.team-loss { background: var(--loss-bg); color: var(--loss); }
.team-side { font-weight: 500; font-size: 0.75rem; opacity: 0.7; }

.team-players { display: flex; flex-direction: column; }
.team-player { display: flex; align-items: center; gap: var(--space-sm); padding: 6px var(--space-lg); border-bottom: 1px solid rgba(255,255,255,0.03); transition: background var(--transition-fast); }
.team-player:hover { background: var(--bg-hover); }
.team-player.is-me { background: rgba(200, 155, 60, 0.06); }
.team-player:last-child { border-bottom: none; }

.tp-champ { position: relative; flex-shrink: 0; }
.tp-champ-img { width: 32px; height: 32px; border-radius: 4px; border: 1px solid var(--border-color); }
.tp-level { position: absolute; bottom: -1px; right: -1px; background: var(--bg-primary); font-size: 0.55rem; padding: 0 2px; border-radius: 2px; color: var(--text-muted); }

.tp-spells { display: flex; flex-direction: column; gap: 1px; flex-shrink: 0; }
.tp-spell { width: 16px; height: 16px; border-radius: 2px; }

.tp-info { min-width: 120px; overflow: hidden; }
.tp-name { font-size: 0.8rem; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
.tp-name-me { color: var(--accent-gold) !important; font-weight: 700; }
.tp-tag { font-size: 0.65rem; color: var(--text-muted); }

.tp-kda { min-width: 80px; text-align: center; }
.tp-kda-nums { font-size: 0.8rem; font-weight: 600; }
.tp-kda-ratio { font-size: 0.65rem; font-weight: 600; display: block; }

.tp-damage { min-width: 100px; }
.damage-bar { height: 6px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; margin-bottom: 2px; }
.damage-fill { height: 100%; background: linear-gradient(90deg, var(--accent-blue), #4fc3f7); border-radius: 3px; transition: width 0.5s ease; }
.damage-fill-red { background: linear-gradient(90deg, var(--loss), #ff7675); }
.tp-dmg-text { font-size: 0.65rem; color: var(--text-muted); }

.tp-cs, .tp-gold { min-width: 55px; font-size: 0.75rem; color: var(--text-secondary); text-align: center; }
.tp-gold { color: var(--accent-gold); }

.tp-items { display: flex; gap: 2px; margin-left: auto; }
.tp-item { width: 22px; height: 22px; border-radius: 3px; border: 1px solid var(--border-color); }

@media (max-width: 1200px) {
  .match-players-preview { display: none; }
}
@media (max-width: 768px) {
  .match-main { flex-wrap: wrap; gap: var(--space-sm); padding: var(--space-sm) var(--space-md); }
  .match-result { min-width: 65px; }
  .champ-img { width: 40px; height: 40px; }
  .items-grid { grid-template-columns: repeat(4, 1fr); }
  .tp-info { min-width: 80px; }
  .tp-kda { min-width: 60px; }
  .team-player { padding: 5px var(--space-md); gap: 4px; }
  .tp-champ-img { width: 26px; height: 26px; }
  .tp-item { width: 18px; height: 18px; }
}
</style>
