<template>
  <div class="tierlist-page container">
    <div class="page-header animate-fade-in-up">
      <h1 class="font-heading">Tier List <span class="text-gold">Builder</span></h1>
      <p class="page-desc">Crea i gestiona les teves tier lists de campions personalitzades</p>
      <button class="create-btn" @click="openCreateModal">
        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
        Nova Tier List
      </button>
    </div>

    <!-- Tier Lists Grid -->
    <div v-if="tierLists.length > 0" class="tierlist-grid">
      <div
        v-for="(tl, index) in tierLists"
        :key="tl.id"
        class="tierlist-item card animate-fade-in-up"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <div class="tierlist-item-header">
          <div>
            <h3>{{ tl.name }}</h3>
            <p class="tierlist-item-desc">{{ tl.description || 'Sense descripció' }}</p>
            <span class="tierlist-date">{{ formatDate(tl.createdAt) }}</span>
          </div>
          <div class="tierlist-actions">
            <button class="action-btn edit" @click="openEditModal(tl)" title="Editar">
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
            </button>
            <button class="action-btn delete" @click="confirmDelete(tl)" title="Eliminar">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            </button>
          </div>
        </div>
        <div class="tier-rows">
          <div v-for="tier in tiers" :key="tier.key" class="tier-row">
            <div class="tier-label" :style="{ background: tier.color }">{{ tier.key }}</div>
            <div class="tier-champions">
              <img
                v-for="champ in getTierChampions(tl, tier.key)"
                :key="champ.id"
                :src="champ.img"
                :alt="champ.name"
                :title="champ.name"
                class="tier-champ-img"
                loading="lazy"
              />
              <span v-if="getTierChampions(tl, tier.key).length === 0" class="empty-tier">—</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state card animate-fade-in">
      <div class="empty-icon">📋</div>
      <h3>No tens cap tier list</h3>
      <p>Crea la teva primera tier list de campions!</p>
      <button class="create-btn" @click="openCreateModal">
        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
        Nova Tier List
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal card animate-fade-in-up">
          <div class="modal-header">
            <h2>{{ editing ? 'Editar' : 'Crear' }} Tier List</h2>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="tl-name">Nom</label>
              <input id="tl-name" v-model="form.name" type="text" placeholder="Ex: Patch 14.10 Top Lane" class="form-input" />
            </div>
            <div class="form-group">
              <label for="tl-desc">Descripció (opcional)</label>
              <input id="tl-desc" v-model="form.description" type="text" placeholder="Breu descripció de la tier list" class="form-input" />
            </div>

            <!-- Tier Sections -->
            <div class="tier-editor">
              <div v-for="tier in tiers" :key="tier.key" class="tier-editor-row">
                <div class="tier-editor-label" :style="{ background: tier.color }">{{ tier.key }}</div>
                <div class="tier-editor-champions">
                  <div
                    v-for="champ in form.tiers[tier.key]"
                    :key="champ.id"
                    class="tier-editor-champ"
                    @click="removeFromTier(tier.key, champ.id)"
                    :title="'Eliminar ' + champ.name"
                  >
                    <img :src="champ.img" :alt="champ.name" />
                    <div class="remove-badge">✕</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Champion Selector -->
            <div class="champ-selector">
              <h4>Afegir campions</h4>
              <input
                v-model="champSearch"
                type="text"
                placeholder="Buscar campió..."
                class="form-input champ-search"
              />
              <div class="champ-selector-row">
                <label class="tier-select-label">Afegir a tier:</label>
                <select v-model="selectedTier" class="tier-select">
                  <option v-for="tier in tiers" :key="tier.key" :value="tier.key">{{ tier.key }} Tier</option>
                </select>
              </div>
              <div class="champ-grid">
                <div
                  v-for="champ in filteredChampions"
                  :key="champ.id"
                  class="champ-grid-item"
                  :class="{ used: isChampUsed(champ.id) }"
                  @click="addToTier(champ)"
                  :title="champ.name"
                >
                  <img :src="champ.img" :alt="champ.name" loading="lazy" />
                  <span>{{ champ.name }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="closeModal">Cancel·lar</button>
            <button class="btn-save" @click="saveTierList" :disabled="!form.name.trim()">
              {{ editing ? 'Guardar' : 'Crear' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
        <div class="modal modal-sm card animate-fade-in-up">
          <div class="modal-header">
            <h2>Confirmar eliminació</h2>
          </div>
          <div class="modal-body">
            <p>Estàs segur que vols eliminar <strong>"{{ deleteTarget?.name }}"</strong>?</p>
            <p class="text-muted" style="font-size: 0.85rem; margin-top: 8px;">Aquesta acció no es pot desfer.</p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="showDeleteConfirm = false">Cancel·lar</button>
            <button class="btn-delete" @click="deleteTierList">Eliminar</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import dataDragon from '../services/dataDragon'

const tiers = [
  { key: 'S', color: '#ff7675' },
  { key: 'A', color: '#fdcb6e' },
  { key: 'B', color: '#74b9ff' },
  { key: 'C', color: '#a29bfe' },
  { key: 'D', color: '#636e72' },
]

const tierLists = ref([])
const allChampions = ref([])
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const editing = ref(false)
const editId = ref(null)
const deleteTarget = ref(null)
const champSearch = ref('')
const selectedTier = ref('S')

const form = reactive({
  name: '',
  description: '',
  tiers: { S: [], A: [], B: [], C: [], D: [] },
})

// Load champions from Data Dragon
onMounted(async () => {
  loadFromStorage()
  try {
    const champions = await dataDragon.getChampions()
    const version = await dataDragon.getVersion()
    allChampions.value = Object.values(champions).map(c => ({
      id: c.id,
      name: c.name,
      img: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${c.id}.png`,
    })).sort((a, b) => a.name.localeCompare(b.name))
  } catch (err) {
    console.error('Error loading champions:', err)
  }
})

// LocalStorage
function loadFromStorage() {
  const stored = localStorage.getItem('lol-tier-lists')
  if (stored) tierLists.value = JSON.parse(stored)
}

function saveToStorage() {
  localStorage.setItem('lol-tier-lists', JSON.stringify(tierLists.value))
}

// CRUD Operations
function openCreateModal() {
  editing.value = false
  editId.value = null
  form.name = ''
  form.description = ''
  form.tiers = { S: [], A: [], B: [], C: [], D: [] }
  champSearch.value = ''
  selectedTier.value = 'S'
  showModal.value = true
}

function openEditModal(tl) {
  editing.value = true
  editId.value = tl.id
  form.name = tl.name
  form.description = tl.description
  form.tiers = {
    S: [...(tl.tiers.S || [])],
    A: [...(tl.tiers.A || [])],
    B: [...(tl.tiers.B || [])],
    C: [...(tl.tiers.C || [])],
    D: [...(tl.tiers.D || [])],
  }
  champSearch.value = ''
  selectedTier.value = 'S'
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function saveTierList() {
  if (!form.name.trim()) return

  if (editing.value) {
    const idx = tierLists.value.findIndex(t => t.id === editId.value)
    if (idx !== -1) {
      tierLists.value[idx] = {
        ...tierLists.value[idx],
        name: form.name.trim(),
        description: form.description.trim(),
        tiers: JSON.parse(JSON.stringify(form.tiers)),
        updatedAt: Date.now(),
      }
    }
  } else {
    tierLists.value.unshift({
      id: Date.now().toString(),
      name: form.name.trim(),
      description: form.description.trim(),
      tiers: JSON.parse(JSON.stringify(form.tiers)),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  }

  saveToStorage()
  closeModal()
}

function confirmDelete(tl) {
  deleteTarget.value = tl
  showDeleteConfirm.value = true
}

function deleteTierList() {
  tierLists.value = tierLists.value.filter(t => t.id !== deleteTarget.value.id)
  saveToStorage()
  showDeleteConfirm.value = false
  deleteTarget.value = null
}

// Champions management
function addToTier(champ) {
  if (isChampUsed(champ.id)) return
  form.tiers[selectedTier.value].push({ id: champ.id, name: champ.name, img: champ.img })
}

function removeFromTier(tierKey, champId) {
  form.tiers[tierKey] = form.tiers[tierKey].filter(c => c.id !== champId)
}

function isChampUsed(champId) {
  return Object.values(form.tiers).some(arr => arr.some(c => c.id === champId))
}

function getTierChampions(tl, tierKey) {
  return tl.tiers[tierKey] || []
}

const filteredChampions = computed(() => {
  if (!champSearch.value) return allChampions.value
  const q = champSearch.value.toLowerCase()
  return allChampions.value.filter(c => c.name.toLowerCase().includes(q))
})

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('ca-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.tierlist-page {
  padding: var(--space-2xl) var(--space-md) var(--space-3xl);
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-sm);
}

.page-desc {
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  background: linear-gradient(135deg, var(--accent-gold), #daa520);
  color: var(--bg-primary);
  font-weight: 700;
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow-gold);
}

.create-btn svg {
  width: 18px;
  height: 18px;
}

/* Tier List Grid */
.tierlist-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.tierlist-item {
  padding: var(--space-lg);
}

.tierlist-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
}

.tierlist-item-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
}

.tierlist-item-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.tierlist-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.tierlist-actions {
  display: flex;
  gap: var(--space-xs);
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.edit:hover {
  background: rgba(10, 200, 185, 0.2);
  color: var(--accent-blue);
}

.action-btn.delete:hover {
  background: rgba(234, 84, 85, 0.2);
  color: var(--loss);
}

/* Tier Rows */
.tier-rows {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.tier-row {
  display: flex;
  min-height: 48px;
  border-bottom: 1px solid var(--border-color);
}

.tier-row:last-child {
  border-bottom: none;
}

.tier-label {
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--bg-primary);
  flex-shrink: 0;
}

.tier-champions {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px 8px;
  background: var(--bg-tertiary);
}

.tier-champ-img {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.empty-tier {
  color: var(--text-muted);
  font-size: 0.8rem;
}

/* Empty State */
.empty-state {
  max-width: 400px;
  margin: var(--space-2xl) auto;
  text-align: center;
  padding: var(--space-3xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.empty-icon {
  font-size: 3rem;
}

.empty-state p {
  color: var(--text-secondary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: var(--space-md);
}

.modal {
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-sm {
  max-width: 420px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.2rem;
  font-weight: 700;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.modal-body {
  padding: var(--space-xl);
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  border-top: 1px solid var(--border-color);
}

/* Form */
.form-group {
  margin-bottom: var(--space-md);
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
}

.form-input {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-input);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  border-color: var(--accent-gold);
}

.form-input::placeholder {
  color: var(--text-muted);
}

/* Tier Editor */
.tier-editor {
  margin: var(--space-lg) 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.tier-editor-row {
  display: flex;
  min-height: 52px;
  border-bottom: 1px solid var(--border-color);
}

.tier-editor-row:last-child {
  border-bottom: none;
}

.tier-editor-label {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  color: var(--bg-primary);
  flex-shrink: 0;
}

.tier-editor-champions {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 6px 8px;
  background: var(--bg-tertiary);
  align-items: center;
}

.tier-editor-champ {
  position: relative;
  cursor: pointer;
}

.tier-editor-champ img {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.tier-editor-champ:hover img {
  opacity: 0.5;
}

.remove-badge {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--loss);
  font-weight: 700;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.tier-editor-champ:hover .remove-badge {
  opacity: 1;
}

/* Champion Selector */
.champ-selector {
  margin-top: var(--space-lg);
}

.champ-selector h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

.champ-search {
  margin-bottom: var(--space-sm);
}

.champ-selector-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.tier-select-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.tier-select {
  padding: var(--space-xs) var(--space-sm);
  background: var(--bg-input);
  color: var(--accent-gold);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
}

.tier-select option {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.champ-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.champ-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.champ-grid-item:hover:not(.used) {
  background: var(--bg-hover);
}

.champ-grid-item.used {
  opacity: 0.25;
  cursor: not-allowed;
}

.champ-grid-item img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.champ-grid-item span {
  font-size: 0.6rem;
  color: var(--text-secondary);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* Buttons */
.btn-cancel {
  padding: var(--space-sm) var(--space-lg);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  font-weight: 600;
  transition: all var(--transition-fast);
}

.btn-cancel:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.btn-save {
  padding: var(--space-sm) var(--space-lg);
  background: var(--accent-gold);
  color: var(--bg-primary);
  border-radius: var(--radius-sm);
  font-weight: 700;
  transition: all var(--transition-fast);
}

.btn-save:hover:not(:disabled) {
  background: var(--accent-gold-light);
}

.btn-save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-delete {
  padding: var(--space-sm) var(--space-lg);
  background: var(--loss);
  color: white;
  border-radius: var(--radius-sm);
  font-weight: 700;
  transition: all var(--transition-fast);
}

.btn-delete:hover {
  background: #c0392b;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.8rem;
  }

  .modal {
    max-height: 95vh;
  }

  .champ-grid {
    grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
  }

  .tier-label,
  .tier-editor-label {
    width: 36px;
    font-size: 0.9rem;
  }
}
</style>
