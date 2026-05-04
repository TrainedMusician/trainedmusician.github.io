<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let visible = $state(false);

  onMount(() => {
    const onScroll = () => { visible = window.scrollY > 400; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

{#if visible}
  <button
    transition:fade={{ duration: 150 }}
    class="back-to-top"
    onclick={scrollToTop}
    aria-label="Back to top"
  >
    ↑
  </button>
{/if}

<style>
  .back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 99;

    width: 44px;
    height: 44px;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    background: var(--bg-raised);
    border: 1px solid var(--border);
    color: var(--accent);
    font-size: 1.1rem;
    cursor: pointer;

    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }

  .back-to-top:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--bg);
    transform: translateY(-3px);
  }
</style>
