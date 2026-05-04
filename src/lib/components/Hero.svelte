<script lang="ts">
    import {personal} from '$lib/data/cv';
    import {Laugh} from "@lucide/svelte";
</script>

<section id="hero" class="hero">
  <div class="container">
    <div class="inner">
      <p class="greeting">Hi there <Laugh/></p>
      <h1 class="name">{personal.name}</h1>
      <p class="title">{personal.title}</p>
      <p class="tagline">{personal.tagline}</p>

      <div class="actions">
        <a href="mailto:{personal.email}" class="btn primary">Get in touch</a>
      </div>
    </div>
  </div>

  <!-- Ambient background glow -->
  <div class="glow" aria-hidden="true"></div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding-top: 64px; /* nav height */
  }

  .inner {
    position: relative;
    z-index: 1;
    max-width: 660px;
  }

  /* Staggered entrance animations */
  .greeting, .name, .title, .tagline, .actions {
    animation: fadeUp 0.65s ease both;
  }
  .greeting  { animation-delay: 0ms; }
  .name      { animation-delay: 80ms; }
  .title     { animation-delay: 160ms; }
  .tagline   { animation-delay: 240ms; }
  .actions   { animation-delay: 360ms; }

  .greeting {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    margin-bottom: 0.75rem;
  }

  .name {
    font-size: clamp(2.8rem, 8vw, 5rem);
    font-weight: 800;
    line-height: 1.05;
    margin-bottom: 0.5rem;
  }

  .title {
    font-family: var(--font-mono);
    font-size: 1rem;
    color: var(--accent);
    letter-spacing: 0.06em;
    margin-bottom: 1.5rem;
  }

  .tagline {
    font-size: 1.1rem;
    color: var(--text-muted);
    max-width: 520px;
    line-height: 1.75;
    margin-bottom: 1.75rem;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .btn {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.6rem 1.25rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-muted);
    background: var(--bg-raised);
    transition: border-color 0.2s ease, color 0.2s ease;
  }

  .btn:hover {
    border-color: var(--accent);
    color: var(--accent);
    opacity: 1;
  }

  .btn.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--bg);
    font-weight: 600;
  }

  .btn.primary:hover {
    opacity: 0.85;
  }

  /* Ambient glow top-right */
  .glow {
    position: absolute;
    top: -160px;
    right: -200px;
    width: 640px;
    height: 640px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--accent-glow) 0%, transparent 68%);
    pointer-events: none;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 640px) {
    .hero {
      min-height: auto;
      padding-top: 110px;
      padding-bottom: 4rem;
    }
  }
</style>
