<script lang="ts">
  import { personal } from '$lib/data/cv';
  import { onMount } from 'svelte';

  const navLinks = [
    { id: 'skills',     label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact',    label: 'Contact' },
  ];

  let activeSection = $state('');

  onMount(() => {
    const observers: IntersectionObserver[] = [];

    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) activeSection = id; },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  });

  const initials = personal.name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .join('');
</script>

<nav>
  <div class="container nav-inner">
    <a href="#" class="brand">{initials}</a>

    <ul class="links">
      {#each navLinks as { id, label }}
        <li>
          <a href="#{id}" class:active={activeSection === id}>{label}</a>
        </li>
      {/each}
    </ul>
  </div>
</nav>

<style>
  nav {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: 100;
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    background: rgba(14, 17, 23, 0.75);
    border-bottom: 1px solid var(--border);
  }

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .brand {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text);
    letter-spacing: 0.06em;
    transition: color 0.2s ease;
  }

  .brand:hover {
    color: var(--accent);
    opacity: 1;
  }

  .links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .links a {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color 0.2s ease;
  }

  .links a:hover,
  .links a.active {
    color: var(--accent);
    opacity: 1;
  }

  @media (max-width: 480px) {
    .links { gap: 1.25rem; }
    .links a { font-size: 0.68rem; }
  }
</style>
