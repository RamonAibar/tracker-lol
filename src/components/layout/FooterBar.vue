<template>
  <footer class="footer">
    <div class="footer-inner container">
      <div class="footer-brand">
        <span class="font-heading text-gold">LoL Tracker</span>
        <p class="footer-desc">Aplicació de seguiment d'estadístiques de League of Legends.</p>
      </div>
      <div class="footer-links">
        <router-link to="/">Inici</router-link>
        <router-link to="/search">Cerca</router-link>
        <router-link to="/tierlist">Tier Lists</router-link>
      </div>
      <div class="footer-credits">
        <p>Desenvolupat per <strong class="text-gold">Ramon Aibar</strong></p>
        <p class="footer-student">Estudiant de 2n ASIX — IES Ebre</p>
        <p class="footer-disclaimer">
          LoL Tracker no està avalat per Riot Games i no reflecteix les opinions de Riot Games
          ni de ningú involucrat en la producció o gestió de propietats de Riot Games.
        </p>
        <p class="footer-year">© {{ currentYear }} — Projecte educatiu</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: var(--space-2xl) 0 var(--space-lg);
  margin-top: var(--space-3xl);
}

.footer-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-xl);
  align-items: start;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer-brand .font-heading {
  font-size: 1.2rem;
}

.footer-desc {
  color: var(--text-secondary);
  font-size: 0.85rem;
  max-width: 280px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer-links a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--accent-gold);
}

.footer-credits {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer-credits p {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.footer-disclaimer {
  font-size: 0.75rem !important;
  color: var(--text-muted) !important;
  max-width: 320px;
  margin-left: auto;
}

.footer-year {
  color: var(--text-muted) !important;
  font-size: 0.8rem !important;
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-credits {
    text-align: center;
  }

  .footer-desc,
  .footer-disclaimer {
    max-width: 100%;
    margin: 0 auto;
  }
}
</style>
