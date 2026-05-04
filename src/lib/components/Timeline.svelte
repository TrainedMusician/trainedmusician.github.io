<script lang="ts">
  import { onMount }    from 'svelte';
  import { experience } from '$lib/data/cv';

  // ── Layout ──────────────────────────────────────────────────
  const SVG_W   = 500;
  const ENTRY_H = 320;
  const PAD_V   = 200;   // generous top/bottom padding — loop lives up here
  const CX      = SVG_W / 2;
  const SWING   = 150;
  const SVG_H   = PAD_V * 2 + experience.length * ENTRY_H;

  // ── Anchors (one per entry) ──────────────────────────────────
  type Anchor = { x: number; y: number; side: 'left' | 'right' };

  const anchors: Anchor[] = experience.map((_, i) => ({
    x:    i % 2 === 0 ? CX - SWING : CX + SWING,
    y:    PAD_V + ENTRY_H * i + ENTRY_H / 2,
    side: (i % 2 === 0 ? 'left' : 'right') as 'left' | 'right',
  }));

  // ── Path builder ─────────────────────────────────────────────
  //
  // Structure:
  //   1.  Short lead-in stroke from the very top down to the loop
  //   2.  A full clockwise circle (4 arc quadrants) — the "loopyloop"
  //       The path exits 8px below where it entered, creating a visible gap
  //       that reads as a loop when the hand-drawn filter is applied.
  //   3.  S-curve beziers connecting all anchors
  //   4.  Short lead-out to the bottom
  //
  function buildPath(): string {
    const LOOP_TOP_Y  = PAD_V * 0.35;     // y at top of loop (path entry into circle)
    const LOOP_EXIT_Y = LOOP_TOP_Y + 8;   // exit is 8px below entry — produces the "loop gap"

    let d = `M ${CX} ${PAD_V * 0.12}`;

    // ── 1. Lead-in ──
    d += ` C ${CX} ${LOOP_TOP_Y - 30}, ${CX} ${LOOP_TOP_Y - 10}, ${CX} ${LOOP_TOP_Y}`;

    // ── 2. S-curves through anchors ──
    const waypoints = [
      { x: CX, y: LOOP_EXIT_Y },
      ...anchors,
      { x: CX, y: SVG_H - PAD_V * 0.35 },
    ];

    for (let i = 1; i < waypoints.length; i++) {
      const p    = waypoints[i - 1];
      const c    = waypoints[i];
      const midY = (p.y + c.y) / 2;
      d += ` C ${p.x} ${midY}, ${c.x} ${midY}, ${c.x} ${c.y}`;
    }

    return d;
  }

  const pathD = buildPath();

  // ── DOM refs ─────────────────────────────────────────────────
  let pathEl:    SVGPathElement;
  let sectionEl: HTMLElement;

  // ── State ─────────────────────────────────────────────────────
  let totalLen = $state(0);
  let progress = $state(0);       // 0–1, scroll-driven
  let tValues  = $state<number[]>([]);

  let dashOffset = $derived(totalLen * (1 - progress));

  function reached(i: number): boolean {
    return tValues.length > 0 && progress >= tValues[i] - 0.02;
  }

  // ── Mount ────────────────────────────────────────────────────
  onMount(() => {
    totalLen = pathEl.getTotalLength();

    // Find the fraction along the path closest to each anchor
    const SAMPLES = 600;
    tValues = anchors.map((anchor) => {
      let best = 0, bestDist = Infinity;
      for (let s = 0; s <= SAMPLES; s++) {
        const f  = s / SAMPLES;
        const pt = pathEl.getPointAtLength(f * totalLen);
        const d  = Math.hypot(pt.x - anchor.x, pt.y - anchor.y);
        if (d < bestDist) { bestDist = d; best = f; }
      }
      return best;
    });

    // ── Scroll handler ──────────────────────────────────────────
    //
    // The "drawing cursor" is fixed at CURSOR_Y (60 % down the viewport).
    // progress = how far the section has scrolled past that cursor,
    // normalised to the full section height.
    //
    // progress = 0  →  section top is at the cursor
    // progress = 1  →  section bottom is at the cursor
    //
    // This keeps the drawn tip close to the cursor as you scroll,
    // so the line follows your position rather than racing ahead.
    //
    const CURSOR_Y = 0.6;

    const onScroll = () => {
      const r       = sectionEl.getBoundingClientRect();
      const drawnPx = window.innerHeight * CURSOR_Y - r.top;
      progress      = Math.max(0, Math.min(1, drawnPx / r.height));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<section id="experience" bind:this={sectionEl}>
  <div class="container">
    <p class="section-eyebrow">02 / Experience</p>
    <h2 class="section-heading">What I've done so far</h2>

    <div class="stage" style="height:{SVG_H}px">

      <!-- ── SVG ──────────────────────────────────────────── -->
      <svg
        viewBox="0 0 {SVG_W} {SVG_H}"
        preserveAspectRatio="xMidYMid meet"
        class="track"
        aria-hidden="true"
      >
        <defs>
          <filter id="hand-drawn" x="-6%" y="-2%" width="112%" height="104%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.032"
              numOctaves="2"
              seed="9"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4"
              xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>

        <!-- Ghost path (shows where line will go) -->
        <path d={pathD} stroke="var(--accent)" stroke-width="1.5"
          fill="none" stroke-linecap="round" opacity="0.07"
          filter="url(#hand-drawn)"/>

        <!-- Animated drawing path -->
        <path
          bind:this={pathEl}
          d={pathD}
          stroke="var(--accent)"
          stroke-width="2.5"
          fill="none"
          stroke-linecap="round"
          filter="url(#hand-drawn)"
          stroke-dasharray={totalLen || 9999}
          stroke-dashoffset={dashOffset}
        />

        <!-- Entry dot (top of path) -->
        <circle
          cx={CX} cy={0}
          r="3" fill="var(--accent)" opacity="0.4"
        />

        <!-- Anchor dots -->
        {#each anchors as anchor, i}
          {@const vis = reached(i)}
          <circle cx={anchor.x} cy={anchor.y} r="13"
            fill="var(--accent)" class="dot-glow"
            class:visible={vis}
            style="transition-delay:{i * 60}ms"/>
          <circle cx={anchor.x} cy={anchor.y} r="5.5"
            fill="var(--accent)" class="dot"
            class:visible={vis}
            style="transition-delay:{i * 60}ms"/>
        {/each}
      </svg>

      <!-- ── Cards ─────────────────────────────────────────── -->
      {#each anchors as anchor, i}
        {@const vis = reached(i)}
        {@const job = experience[i]}
        <div
          class="card"
          class:left={anchor.side === 'left'}
          class:right={anchor.side === 'right'}
          class:visible={vis}
          style="
            top: {(anchor.y / SVG_H) * 100}%;
            {anchor.side === 'left'
              ? 'right: calc(50% + 32px)'
              : 'left: calc(50% + 32px)'};
            transition-delay: {i * 60 + 80}ms;
          "
        >
          <h3 class="role">{job.role}</h3>
          <div class="meta">
            <span class="company">{job.company}</span>
            <span class="sep">·</span>
            <span class="muted">{job.period}</span>
          </div>
          <ul class="bullets">
            {#each job.bullets as bullet}
              <li>{bullet}</li>
            {/each}
          </ul>
        </div>
      {/each}

    </div>
  </div>
</section>

<style>
  .stage {
    position: relative;
    width: 100%;
  }

  .track {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  /* ── SVG dots ────────────────────────────── */
  .dot-glow {
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .dot-glow.visible { opacity: 0.13; }

  .dot {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .dot.visible { opacity: 1; }

  /* ── Cards ───────────────────────────────── */
  .card {
    position: absolute;
    width: 42%;
    transform: translateY(-50%) translateX(var(--slide-x));
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.4rem 1.5rem;
    opacity: 0;
    transition: opacity 0.45s ease, transform 0.45s ease;
  }

  .card.left  { --slide-x: -10px; }
  .card.right { --slide-x:  10px; }

  .card.visible {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

  .card:hover { border-color: rgba(0, 200, 160, 0.3); }

  .role {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 0.4rem;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.3rem;
    margin-bottom: 1rem;
  }

  .company {
    font-family: var(--font-mono);
    font-size: 0.73rem;
    color: var(--accent);
  }

  .sep { color: var(--border); font-size: 0.9rem; }

  .muted {
    font-family: var(--font-mono);
    font-size: 0.73rem;
    color: var(--text-muted);
  }

  .bullets {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .bullets li {
    font-size: 0.875rem;
    color: var(--text-muted);
    padding-left: 1.1rem;
    position: relative;
    line-height: 1.6;
  }

  .bullets li::before {
    content: '▸';
    position: absolute;
    left: 0;
    top: 5px;
    font-size: 0.6rem;
    color: var(--accent);
  }

  /* ── Mobile fallback ─────────────────────── */
  @media (max-width: 720px) {
    .track { display: none; }

    .stage {
      height: auto !important;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .card {
      position: static !important;
      width: 100%   !important;
      transform: none  !important;
      opacity: 1    !important;
      transition: none !important;
    }
  }
</style>
