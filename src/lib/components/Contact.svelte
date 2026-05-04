<script lang="ts">
  import { personal } from '$lib/data/cv';
  import { inview } from '$lib/actions/inview';
</script>

<section id="contact">
  <div class="container">
    <p class="section-eyebrow">03 / Contact</p>
    <h2 class="section-heading">Get in touch</h2>

    <div class="content reveal" use:inview>
      <p class="blurb">
        I'm open to interesting conversations — whether that's a new role,
        a side project, or just a technical discussion. Drop me an email.
      </p>
      <a href="mailto:{personal.email}" class="cta">
        {personal.email}
      </a>
    </div>
  </div>
</section>

<style>
  .content {
    max-width: 540px;
  }

  .blurb {
    font-size: 1.05rem;
    color: var(--text-muted);
    line-height: 1.75;
    margin-bottom: 2rem;
  }

  .cta {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.88rem;
    letter-spacing: 0.05em;
    padding: 0.8rem 1.75rem;
    background: var(--accent);
    color: var(--bg);
    border-radius: var(--radius);
    font-weight: 600;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .cta:hover {
    opacity: 0.85;
    transform: translateY(-2px);
  }
</style>
