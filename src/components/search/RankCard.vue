<template>
  <div class="rank-card card" :class="tierClass">
    <div class="rank-header">
      <span class="queue-name">{{ queueName }}</span>
    </div>
    <div class="rank-body">
      <img :src="emblemSrc" :alt="entry.tier" class="rank-emblem" loading="lazy" />
      <div class="rank-info">
        <div class="rank-tier">
          <span class="tier-name">{{ entry.tier }}</span>
          <span class="tier-division">{{ entry.rank }}</span>
        </div>
        <div class="rank-lp">{{ entry.leaguePoints }} LP</div>
        <div class="rank-record">
          <span class="wins">{{ entry.wins }}W</span>
          <span class="losses">{{ entry.losses }}L</span>
          <span class="winrate" :class="winrateClass">{{ winrate }}%</span>
        </div>
      </div>
    </div>
    <div class="rank-bar">
      <div class="rank-bar-fill" :style="{ width: winrate + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import dataDragon from '../../services/dataDragon'

const props = defineProps({
  entry: { type: Object, required: true },
})

const queueName = computed(() => {
  if (props.entry.queueType === 'RANKED_SOLO_5x5') return 'Ranked Solo/Duo'
  if (props.entry.queueType === 'RANKED_FLEX_SR') return 'Ranked Flex'
  return props.entry.queueType
})

const emblemSrc = computed(() => dataDragon.getRankEmblem(props.entry.tier))

const winrate = computed(() => {
  const total = props.entry.wins + props.entry.losses
  return total > 0 ? Math.round((props.entry.wins / total) * 100) : 0
})

const winrateClass = computed(() => {
  if (winrate.value >= 55) return 'high'
  if (winrate.value <= 45) return 'low'
  return ''
})

const tierClass = computed(() => props.entry.tier?.toLowerCase())
</script>

<style scoped>
.rank-card {
  padding: var(--space-lg);
  position: relative;
  overflow: hidden;
}

.rank-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-gold);
  opacity: 0.5;
}

.rank-card.iron::before { background: var(--iron); }
.rank-card.bronze::before { background: var(--bronze); }
.rank-card.silver::before { background: var(--silver); }
.rank-card.gold::before { background: var(--gold); }
.rank-card.platinum::before { background: var(--platinum); }
.rank-card.emerald::before { background: var(--emerald); }
.rank-card.diamond::before { background: var(--diamond); }
.rank-card.master::before { background: var(--master); }
.rank-card.grandmaster::before { background: var(--grandmaster); }
.rank-card.challenger::before { background: var(--challenger); }

.rank-header {
  margin-bottom: var(--space-md);
}

.queue-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rank-body {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.rank-emblem {
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
}

.rank-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.rank-tier {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
}

.tier-name {
  font-size: 1.4rem;
  font-weight: 800;
  text-transform: capitalize;
}

.tier-division {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.rank-lp {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--accent-gold);
}

.rank-record {
  display: flex;
  gap: var(--space-sm);
  font-size: 0.85rem;
}

.wins {
  color: var(--win);
  font-weight: 600;
}

.losses {
  color: var(--loss);
  font-weight: 600;
}

.winrate {
  color: var(--text-secondary);
  font-weight: 500;
}

.winrate.high {
  color: var(--win);
}

.winrate.low {
  color: var(--loss);
}

.rank-bar {
  margin-top: var(--space-md);
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.rank-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--win), var(--accent-blue));
  border-radius: 2px;
  transition: width 1s ease;
}
</style>
