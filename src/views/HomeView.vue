<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-overlay"></div>
        <div class="hero-particles">
          <span v-for="i in 20" :key="i" class="particle" :style="particleStyle(i)"></span>
        </div>
      </div>
      <div class="hero-content container">
        <div class="hero-badge animate-fade-in">
          <span>⚔️ LEAGUE OF LEGENDS TRACKER</span>
        </div>
        <h1 class="hero-title font-heading animate-fade-in-up">
          Domina el <span class="text-gold">Rift</span> amb dades
        </h1>
        <p class="hero-subtitle animate-fade-in-up" style="animation-delay: 0.1s;">
          Cerca qualsevol invocador, analitza les seves estadístiques,
          historial de partides i crea les teves tier lists personalitzades.
        </p>
        <div class="hero-search animate-fade-in-up" style="animation-delay: 0.2s;">
          <SearchBar :large="true" placeholder="Cerca un invocador... (Nom#TAG)" />
        </div>
        <div class="hero-stats animate-fade-in-up" style="animation-delay: 0.3s;">
          <div class="hero-stat">
            <span class="hero-stat-value text-gold">Rangs</span>
            <span class="hero-stat-label">Solo/Duo & Flex</span>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <span class="hero-stat-value text-blue">Historial</span>
            <span class="hero-stat-label">Últimes partides</span>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <span class="hero-stat-value text-gold">Campions</span>
            <span class="hero-stat-label">Maestria & Stats</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features container">
      <h2 class="section-title font-heading">Funcionalitats</h2>
      <div class="features-grid">
        <div
          v-for="(feature, i) in features"
          :key="i"
          class="feature-card card"
          :style="{ animationDelay: `${i * 0.1}s` }"
        >
          <div class="feature-icon" :style="{ background: feature.gradient }">
            <span v-html="feature.icon"></span>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Ranks Preview -->
    <section class="ranks-section container">
      <h2 class="section-title font-heading">Rangs Competitius</h2>
      <div class="ranks-grid">
        <div v-for="rank in ranks" :key="rank.name" class="rank-item">
          <img :src="rank.img" :alt="rank.name" class="rank-img" loading="lazy" />
          <span class="rank-name" :style="{ color: rank.color }">{{ rank.name }}</span>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta container">
      <div class="cta-card glass">
        <h2 class="font-heading">Comença a <span class="text-gold">rastrejar</span></h2>
        <p>Descobreix les estadístiques de qualsevol jugador i millora el teu joc.</p>
        <router-link to="/search" class="cta-btn">
          Cerca un invocador
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import SearchBar from '../components/search/SearchBar.vue'

const features = [
  {
    icon: '🔍',
    title: 'Cerca d\'Invocadors',
    desc: 'Cerca qualsevol jugador per Riot ID i consulta el seu perfil complet amb estadístiques detallades.',
    gradient: 'linear-gradient(135deg, rgba(200,155,60,0.2), rgba(200,155,60,0.05))',
  },
  {
    icon: '📊',
    title: 'Estadístiques en Temps Real',
    desc: 'Rang actual, LP, winrate, KDA mitjà i molt més, tot obtingut directament de les APIs de Riot Games.',
    gradient: 'linear-gradient(135deg, rgba(10,200,185,0.2), rgba(10,200,185,0.05))',
  },
  {
    icon: '🏆',
    title: 'Historial de Partides',
    desc: 'Revisa les últimes partides amb detalls complets: campions, items, KDA, CS, visió i més.',
    gradient: 'linear-gradient(135deg, rgba(155,89,182,0.2), rgba(155,89,182,0.05))',
  },
  {
    icon: '⭐',
    title: 'Campions Favorits',
    desc: 'Descobreix els campions més jugats amb punts de maestria, nivell i estadístiques de rendiment.',
    gradient: 'linear-gradient(135deg, rgba(200,155,60,0.2), rgba(200,155,60,0.05))',
  },
  {
    icon: '📋',
    title: 'Tier List Builder',
    desc: 'Crea les teves pròpies tier lists personalitzades amb tots els campions del joc organitzats per tiers.',
    gradient: 'linear-gradient(135deg, rgba(10,200,185,0.2), rgba(10,200,185,0.05))',
  },
  {
    icon: '📱',
    title: 'Disseny Responsive',
    desc: 'Interfície adaptada a qualsevol dispositiu: mòbil, tablet o desktop. Sempre a punt.',
    gradient: 'linear-gradient(135deg, rgba(155,89,182,0.2), rgba(155,89,182,0.05))',
  },
]

const ranks = [
  { name: 'Iron', color: '#6b5b4f', img: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/iron.png' },
  { name: 'Bronze', color: '#8c6239', img: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/bronze.png' },
  { name: 'Silver', color: '#7c8b9a', img: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/silver.png' },
  { name: 'Gold', color: '#c89b3c', img: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/gold.png' },
  { name: 'Platinum', color: '#4a9a8c', img: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/platinum.png' },
  { name: 'Emerald', color: '#2d9e5e', img: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/emerald.png' },
  { name: 'Diamond', color: '#576cce', img: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/diamond.png' },
  { name: 'Master', color: '#9d48e0', img: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/master.png' },
  { name: 'Grandmaster', color: '#cd4545', img: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/grandmaster.png' },
  { name: 'Challenger', color: '#f4c874', img: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/challenger.png' },
]

function particleStyle(i) {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${2 + Math.random() * 4}px`,
    height: `${2 + Math.random() * 4}px`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${3 + Math.random() * 4}s`,
  }
}
</script>

<style scoped>
/* Hero */
.hero {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg') center/cover no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 14, 20, 0.85) 0%,
    rgba(10, 14, 20, 0.92) 50%,
    rgba(10, 14, 20, 1) 100%
  );
}

.hero-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: var(--accent-gold);
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat linear infinite;
}

@keyframes particleFloat {
  0% { opacity: 0; transform: translateY(0) scale(0); }
  25% { opacity: 0.6; }
  50% { opacity: 0.3; }
  100% { opacity: 0; transform: translateY(-200px) scale(1); }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-3xl) var(--space-md);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  background: rgba(200, 155, 60, 0.1);
  border: 1px solid rgba(200, 155, 60, 0.3);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--accent-gold);
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.1;
  font-weight: 700;
  max-width: 700px;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--text-secondary);
  max-width: 560px;
  line-height: 1.7;
}

.hero-search {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: var(--space-md);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
  margin-top: var(--space-md);
}

.hero-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hero-stat-value {
  font-size: 1.1rem;
  font-weight: 700;
}

.hero-stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.hero-stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border-color);
}

/* Features */
.features {
  padding: var(--space-3xl) var(--space-md);
}

.section-title {
  text-align: center;
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: var(--space-2xl);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.feature-card {
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  animation: fadeInUp 0.6s ease backwards;
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.feature-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.feature-card p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Ranks */
.ranks-section {
  padding: var(--space-2xl) var(--space-md) var(--space-3xl);
}

.ranks-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-lg);
}

.rank-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  transition: transform var(--transition-fast);
}

.rank-item:hover {
  transform: translateY(-4px);
}

.rank-img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

.rank-name {
  font-size: 0.8rem;
  font-weight: 600;
}

/* CTA */
.cta {
  padding: 0 var(--space-md) var(--space-3xl);
}

.cta-card {
  text-align: center;
  padding: var(--space-3xl);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.cta-card h2 {
  font-size: 2rem;
}

.cta-card p {
  color: var(--text-secondary);
  max-width: 400px;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  background: linear-gradient(135deg, var(--accent-gold), #daa520);
  color: var(--bg-primary);
  font-weight: 700;
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-normal);
  margin-top: var(--space-md);
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow-gold);
  color: var(--bg-primary);
}

.cta-btn svg {
  width: 18px;
  height: 18px;
}

/* Mobile */
@media (max-width: 768px) {
  .hero {
    min-height: 75vh;
  }

  .hero-stats {
    flex-direction: column;
    gap: var(--space-md);
  }

  .hero-stat-divider {
    width: 40px;
    height: 1px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .rank-img {
    width: 48px;
    height: 48px;
  }
}
</style>
