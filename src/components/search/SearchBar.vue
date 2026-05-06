<template>
  <div class="search-bar-container" :class="{ large: large }">
    <form class="search-bar" @submit.prevent="handleSearch">
      <div class="search-input-group" :class="{ focused: isFocused }">
        <select v-model="region" class="search-region">
          <option value="euw1">EUW</option>
          <option value="na1">NA</option>
          <option value="eun1">EUNE</option>
          <option value="kr">KR</option>
          <option value="br1">BR</option>
          <option value="la1">LAN</option>
          <option value="la2">LAS</option>
          <option value="oc1">OCE</option>
          <option value="tr1">TR</option>
          <option value="ru">RU</option>
          <option value="jp1">JP</option>
        </select>
        <div class="search-divider"></div>
        <div class="input-wrapper">
          <svg class="search-icon-inline" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <input
            ref="inputRef"
            v-model="riotId"
            type="text"
            :placeholder="placeholder"
            class="search-input"
            autocomplete="off"
            @focus="onFocus"
            @blur="onBlur"
            @input="onInput"
          />
          <button v-if="riotId" type="button" class="clear-btn" @mousedown.prevent="riotId = ''">✕</button>
        </div>
        <button type="submit" class="search-btn" :disabled="!isValid">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </form>

    <!-- Dropdown: Recent + Filtered -->
    <transition name="dropdown">
      <div v-if="showDropdown && (filteredRecent.length > 0 || riotId)" class="search-dropdown glass">
        <!-- Filtered recent searches -->
        <div v-if="filteredRecent.length > 0" class="dropdown-section">
          <div class="dropdown-header">
            <span>🕒 Cerques recents</span>
            <button v-if="!riotId" class="clear-all-btn" @mousedown.prevent="clearHistory">Esborra tot</button>
          </div>
          <div
            v-for="item in filteredRecent"
            :key="item.key"
            class="dropdown-item"
            @mousedown.prevent="selectRecent(item)"
          >
            <img :src="item.iconUrl" class="dropdown-icon" loading="lazy" @error="e => e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.10.1/img/profileicon/29.png'" />
            <div class="dropdown-info">
              <span class="dropdown-name">{{ item.gameName }}<span class="dropdown-tag">#{{ item.tagLine }}</span></span>
              <span class="dropdown-region">{{ getRegionLabel(item.region) }} · Lvl {{ item.level || '?' }}</span>
            </div>
            <button class="dropdown-remove" @mousedown.prevent.stop="removeFromHistory(item.key)" title="Eliminar">✕</button>
          </div>
        </div>

        <!-- Hint when typing -->
        <div v-if="riotId && !isValid" class="dropdown-hint">
          <svg viewBox="0 0 20 20" fill="currentColor" class="hint-icon"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
          <span>Escriu el Riot ID complet: <strong>Nom#TAG</strong></span>
        </div>
      </div>
    </transition>

    <p v-if="error" class="search-error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  large: { type: Boolean, default: false },
  placeholder: { type: String, default: 'Cerca invocador... (Nom#TAG)' },
  initialRegion: { type: String, default: 'euw1' },
})

const router = useRouter()
const riotId = ref('')
const region = ref(props.initialRegion)
const error = ref('')
const inputRef = ref(null)
const isFocused = ref(false)
const showDropdown = ref(false)
const recentSearches = ref([])

const STORAGE_KEY = 'lol-tracker-recent'
const MAX_RECENT = 10

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) recentSearches.value = JSON.parse(stored)
})

const isValid = computed(() => {
  const parts = riotId.value.trim().split('#')
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0
})

const filteredRecent = computed(() => {
  if (!riotId.value) return recentSearches.value
  const q = riotId.value.toLowerCase()
  return recentSearches.value.filter(s =>
    s.gameName.toLowerCase().includes(q) ||
    s.tagLine.toLowerCase().includes(q) ||
    `${s.gameName}#${s.tagLine}`.toLowerCase().includes(q)
  )
})

function onFocus() {
  isFocused.value = true
  showDropdown.value = true
}

function onBlur() {
  isFocused.value = false
  setTimeout(() => { showDropdown.value = false }, 200)
}

function onInput() {
  showDropdown.value = true
}

function handleSearch() {
  error.value = ''
  const parts = riotId.value.trim().split('#')
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    error.value = 'Format invàlid. Usa: Nom#TAG'
    return
  }
  const [gameName, tagLine] = parts
  showDropdown.value = false
  router.push({
    name: 'summoner',
    params: { region: region.value, gameName, tagLine },
  })
}

function selectRecent(item) {
  region.value = item.region
  riotId.value = `${item.gameName}#${item.tagLine}`
  showDropdown.value = false
  router.push({
    name: 'summoner',
    params: { region: item.region, gameName: item.gameName, tagLine: item.tagLine },
  })
}

function removeFromHistory(key) {
  recentSearches.value = recentSearches.value.filter(s => s.key !== key)
  saveToStorage()
}

function clearHistory() {
  recentSearches.value = []
  saveToStorage()
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches.value))
}

function getRegionLabel(r) {
  const map = { euw1: 'EUW', na1: 'NA', eun1: 'EUNE', kr: 'KR', br1: 'BR', la1: 'LAN', la2: 'LAS', oc1: 'OCE', tr1: 'TR', ru: 'RU', jp1: 'JP' }
  return map[r] || r
}

// Expose methods for parent to add to history
function addToHistory(data) {
  const key = `${data.region}:${data.gameName}:${data.tagLine}`
  recentSearches.value = recentSearches.value.filter(s => s.key !== key)
  recentSearches.value.unshift({ ...data, key })
  if (recentSearches.value.length > MAX_RECENT) recentSearches.value.pop()
  saveToStorage()
}

defineExpose({ focus: () => inputRef.value?.focus(), addToHistory })
</script>

<style scoped>
.search-bar-container {
  position: relative;
  width: 100%;
  max-width: 560px;
}
.search-bar-container.large { max-width: 640px; }

.search-bar { width: 100%; }

.search-input-group {
  display: flex;
  align-items: center;
  background: var(--bg-input);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
}
.search-input-group.focused {
  border-color: var(--accent-gold);
  box-shadow: 0 0 0 3px rgba(200, 155, 60, 0.15), var(--shadow-glow-gold);
}

.search-region {
  background: transparent;
  color: var(--accent-gold);
  padding: 14px 6px 14px 14px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
  min-width: 68px;
}
.search-region option { background: var(--bg-secondary); color: var(--text-primary); }

.search-divider { width: 1px; height: 24px; background: var(--border-color); flex-shrink: 0; }

.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
}

.search-icon-inline {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  margin-left: var(--space-md);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  color: var(--text-primary);
  padding: 14px var(--space-sm);
  font-size: 0.95rem;
}
.search-input::placeholder { color: var(--text-muted); }

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--bg-tertiary);
  color: var(--text-muted);
  border-radius: 50%;
  font-size: 0.65rem;
  margin-right: var(--space-sm);
  transition: all var(--transition-fast);
}
.clear-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

.large .search-region { padding: 18px 6px 18px 18px; font-size: 0.9rem; }
.large .search-input { padding: 18px var(--space-sm); font-size: 1.05rem; }

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  min-height: 100%;
  background: linear-gradient(135deg, var(--accent-gold), #daa520);
  color: var(--bg-primary);
  border: none;
  padding: 14px;
  transition: all var(--transition-fast);
}
.search-btn:hover:not(:disabled) { background: linear-gradient(135deg, var(--accent-gold-light), var(--accent-gold)); }
.search-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.search-btn svg { width: 20px; height: 20px; }
.large .search-btn { width: 56px; padding: 18px; }

/* Dropdown */
.search-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  z-index: 100;
  box-shadow: var(--shadow-lg);
}

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px); }

.dropdown-section { padding: var(--space-sm) 0; }
.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.clear-all-btn {
  background: none;
  color: var(--text-muted);
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all var(--transition-fast);
}
.clear-all-btn:hover { color: var(--loss); background: var(--loss-bg); }

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}
.dropdown-item:hover { background: var(--bg-hover); }

.dropdown-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.dropdown-info { flex: 1; overflow: hidden; }
.dropdown-name { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dropdown-tag { color: var(--text-muted); font-weight: 400; }
.dropdown-region { font-size: 0.7rem; color: var(--text-muted); }

.dropdown-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  color: var(--text-muted);
  border-radius: 50%;
  font-size: 0.65rem;
  opacity: 0;
  transition: all var(--transition-fast);
}
.dropdown-item:hover .dropdown-remove { opacity: 1; }
.dropdown-remove:hover { background: var(--loss-bg); color: var(--loss); }

.dropdown-hint {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  font-size: 0.8rem;
  color: var(--text-muted);
}
.hint-icon { width: 16px; height: 16px; flex-shrink: 0; color: var(--accent-blue); }

.search-error {
  color: var(--loss);
  font-size: 0.8rem;
  margin-top: var(--space-sm);
  padding-left: var(--space-md);
}
</style>
