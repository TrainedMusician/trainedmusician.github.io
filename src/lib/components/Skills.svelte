<script lang="ts">
  import { skills } from '$lib/data/cv';
  import { inview } from '$lib/actions/inview';
</script>

<section id="skills">
  <div class="container">
    <p class="section-eyebrow">01 / Skills</p>
    <h2 class="section-heading">What I work with</h2>

    <div class="grid">
      {#each skills as group, i}
        <div
          class="card reveal"
          use:inview
          style="transition-delay: {i * 55}ms"
        >
          <h3 class="category">{group.category}</h3>
          <ul>
            {#each group.items as item}
              <li>{item}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(195px, 1fr));
    gap: 1rem;
  }

  .card {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem;
    transition:
      border-color 0.2s ease,
      opacity 0.55s ease,
      transform 0.55s ease;
  }

  .card:hover {
    border-color: rgba(0, 200, 160, 0.28);
  }

  .category {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1rem;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  li {
    font-size: 0.9rem;
    color: var(--text-muted);
    padding-left: 0.85rem;
    position: relative;
  }

  li::before {
    content: '–';
    position: absolute;
    left: 0;
    color: var(--accent);
    opacity: 0.5;
  }
</style>
