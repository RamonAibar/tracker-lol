<template>
  <div class="mastery-card card">
    <div class="mastery-header">
      <img :src="championImg" :alt="championName" class="mastery-champ-img" loading="lazy" />
      <div class="mastery-level-badge">{{ mastery.championLevel }}</div>
    </div>
    <div class="mastery-info">
      <h4 class="mastery-name">{{ championName }}</h4>
      <p class="mastery-points">{{ formattedPoints }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dataDragon from '../../services/dataDragon'

const props = defineProps({
  mastery: { type: Object, required: true },
})

const championImg = ref('')
const championName = ref('...')

const formattedPoints = computed(() => {
  const pts = props.mastery.championPoints
  if (pts >= 1000000) return `${(pts / 1000000).toFixed(1)}M pts`
  if (pts >= 1000) return `${(pts / 1000).toFixed(1)}K pts`
  return `${pts} pts`
})

onMounted(async () => {
  const champ = await dataDragon.getChampionById(props.mastery.championId)
  if (champ) {
    championName.value = champ.name
    championImg.value = await dataDragon.getChampionImage(champ.id)
  }
})
</script>

<style scoped>
.mastery-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  transition: all var(--transition-fast);
}

.mastery-card:hover {
  transform: translateY(-2px);
}

.mastery-header {
  position: relative;
  flex-shrink: 0;
}

.mastery-champ-img {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--accent-gold);
}

.mastery-level-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  background: var(--accent-gold);
  color: var(--bg-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
  border: 2px solid var(--bg-card);
}

.mastery-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mastery-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.mastery-points {
  font-size: 0.8rem;
  color: var(--text-secondary);
}
</style>
