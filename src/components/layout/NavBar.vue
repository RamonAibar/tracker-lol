<template>
  <header class="navbar glass" :class="{ scrolled: isScrolled, 'menu-open': menuOpen }">
    <div class="navbar-inner container">
      <router-link to="/" class="navbar-brand" @click="menuOpen = false">
        <div class="brand-icon">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M16 2L2 9v14l14 7 14-7V9L16 2z" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M16 8l-8 4v8l8 4 8-4v-8l-8-4z" fill="currentColor" opacity="0.3"/>
            <path d="M16 12l-4 2v4l4 2 4-2v-4l-4-2z" fill="currentColor"/>
          </svg>
        </div>
        <span class="brand-text font-heading">LoL Tracker</span>
      </router-link>

      <nav class="navbar-nav" :class="{ active: menuOpen }">
        <router-link to="/" class="nav-link" active-class="active" :exact="true" @click="menuOpen = false">
          <svg viewBox="0 0 20 20" fill="currentColor" class="nav-icon">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          <span>Inici</span>
        </router-link>
        <router-link to="/search" class="nav-link" active-class="active" @click="menuOpen = false">
          <svg viewBox="0 0 20 20" fill="currentColor" class="nav-icon">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <span>Cerca</span>
        </router-link>
        <router-link to="/tierlist" class="nav-link" active-class="active" @click="menuOpen = false">
          <svg viewBox="0 0 20 20" fill="currentColor" class="nav-icon">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
          </svg>
          <span>Tier Lists</span>
        </router-link>
      </nav>

      <button class="hamburger show-mobile-only" @click="menuOpen = !menuOpen" :aria-label="menuOpen ? 'Tancar menú' : 'Obrir menú'">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const menuOpen = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 70px;
  background: rgba(10, 14, 20, 0.8);
  border-bottom: 1px solid var(--border-color);
  transition: all var(--transition-normal);
}

.navbar.scrolled {
  background: rgba(10, 14, 20, 0.95);
  box-shadow: var(--shadow-md);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--accent-gold);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.navbar-brand:hover {
  color: var(--accent-gold-light);
  transform: scale(1.02);
}

.brand-icon {
  width: 36px;
  height: 36px;
}

.brand-icon svg {
  width: 100%;
  height: 100%;
}

.brand-text {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-weight: 500;
  font-size: 0.9rem;
  transition: all var(--transition-fast);
  position: relative;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.nav-link.active {
  color: var(--accent-gold);
  background: rgba(200, 155, 60, 0.1);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--accent-gold);
  border-radius: 1px;
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Hamburger */
.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 1px;
  transition: all var(--transition-normal);
}

.hamburger span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger span.open:nth-child(2) {
  opacity: 0;
}

.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Mobile menu */
@media (max-width: 768px) {
  .navbar-nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: var(--bg-secondary);
    flex-direction: column;
    align-items: stretch;
    padding: 90px var(--space-lg) var(--space-lg);
    gap: var(--space-sm);
    transition: right var(--transition-slow);
    border-left: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
  }

  .navbar-nav.active {
    right: 0;
  }

  .nav-link {
    font-size: 1rem;
    padding: var(--space-md);
  }

  .nav-link.active::after {
    display: none;
  }
}
</style>
