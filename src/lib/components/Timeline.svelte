<script lang="ts">
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
    import { onMount } from 'svelte';
    import { experience } from '$lib/data/cv';

    // ── The hand-drawn path from the reference SVG ───────────────
    // This was drawn in a vector tool (Figma/Illustrator) and gives
    // the authentic doodly feel. The viewBox it was designed for is
    // 756 × 1823 — we preserve that so the path stays proportional.
    const PATH_D = `M231.753 0C231.753 125.31 404.656 272.006 350.933 392.982C295.012 518.908 64.0926 532.208 64.0926 681.86C64.0926 929.325 450 725.424 450 1023.92C450 1363.24 9 1434 1.92773 1267.1C9.5 1164.5 130.763 1149.83 184.641 1246.89C267.841 1396.78 195.5 1654.48 195.5 1822.5`;

    const VIEWBOX_W = 756;
    const VIEWBOX_H = 1823;

    // ── Where each entry sits on the path (0–1 fraction) ─────────
    // Tuned to match the visual positions of the path's waypoints.
    // Adjust these if your entries feel early/late.
    const ENTRY_FRACTIONS = [0.1, 0.28, 0.45, 0.8, 0.97];

    // ── DOM refs ──────────────────────────────────────────────────
    let sectionEl: HTMLElement;
    let pathEl:    SVGPathElement;
    let svgEl:     SVGSVGElement;

    // ── Card positions ────────────────────────────────────────────
    // Computed on mount once we know the rendered SVG size.
    type CardPos = {
        top:  number;   // % relative to SVG height
        side: 'left' | 'right';
        dotX: number;   // SVG viewBox coords for the dot
        dotY: number;
    };

    let cardPositions: CardPos[] = $state<CardPos[]>([]);

    // ── Visibility flags (toggled by GSAP) ───────────────────────
    let visible = $state<boolean[]>(experience.map(() => false));

    // ── Mount ─────────────────────────────────────────────────────
    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        const totalLen = pathEl.getTotalLength();

        // Sample the path to get x/y for each entry fraction
        cardPositions = ENTRY_FRACTIONS.slice(0, experience.length).map((frac, i) => {
            const pt = pathEl.getPointAtLength(frac * totalLen);
            return {
                top:  (pt.y / VIEWBOX_H) * 100,
                side: (pt.x < VIEWBOX_W / 2 ? 'left' : 'right') as 'left' | 'right',
                dotX: pt.x,
                dotY: pt.y,
            };
        });

        // ── GSAP main timeline ──────────────────────────────────────
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionEl,
                start: 'top 15%',
                end:   'bottom 85%',
                scrub: 1.2,     // lag in seconds — higher = smoother but lazier
            },
        });

        // Draw the path
        tl.to('.timeline-path', {
            strokeDashoffset: 0,
            ease: 'none',
            duration: 5,
        }, 0);

        // Reveal each card when the line reaches it
        ENTRY_FRACTIONS.slice(0, experience.length).forEach((frac, i) => {
            // frac is 0–1 of path; map to 0–5 timeline duration
            tl.call(() => { visible[i] = true; }, [], frac * 5);
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    });
</script>

<section id="experience" bind:this={sectionEl}>
    <div class="container">
        <p class="section-eyebrow">02 / Experience</p>
        <h2 class="section-heading">Where I've worked</h2>

        <div class="stage">

            <!-- ── SVG: path + dots ──────────────────────────────── -->
            <svg
                    bind:this={svgEl}
                    class="track"
                    viewBox="0 0 {VIEWBOX_W} {VIEWBOX_H}"
                    preserveAspectRatio="xMidYMid meet"
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
                        <feDisplacementMap
                                in="SourceGraphic" in2="noise"
                                scale="3" xChannelSelector="R" yChannelSelector="G"
                        />
                    </filter>
                </defs>

                <!-- Animated drawing path -->
                <path
                        bind:this={pathEl}
                        class="timeline-path"
                        d={PATH_D}
                        stroke="var(--accent)"
                        stroke-width="3"
                        fill="none"
                        stroke-linecap="round"
                        filter="url(#hand-drawn)"
                        stroke-dasharray="3000"
                        stroke-dashoffset="3000"
                />

                <!-- Dots at each entry point -->
                {#each cardPositions as pos, i}
                    <circle
                            cx={pos.dotX} cy={pos.dotY} r="18"
                            fill="var(--accent)"
                            opacity={visible[i] ? 0.12 : 0}
                            style="transition: opacity 0.4s ease {i * 60}ms"
                    />
                    <circle
                            cx={pos.dotX} cy={pos.dotY} r="7"
                            fill="var(--accent)"
                            opacity={visible[i] ? 1 : 0}
                            style="transition: opacity 0.3s ease {i * 60}ms"
                    />
                {/each}
            </svg>

            <!-- ── HTML cards (overlaid on the SVG) ─────────────── -->
            {#each cardPositions as pos, i}
                {@const job = experience[i]}
                <div
                        class="card"
                        class:left={pos.side === 'left'}
                        class:right={pos.side === 'right'}
                        class:visible={visible[i]}
                        style="
            top: {pos.top}%;
            {pos.side === 'left'
              ? 'right: calc(50% + 24px)'
              : 'left: calc(50% + 24px)'};
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
        /* Match the SVG viewBox aspect ratio so cards align */
        aspect-ratio: 756 / 1823;
    }

    .track {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    /* ── Cards ───────────────────────────────────────── */
    .card {
        position: absolute;
        width: 40%;
        transform: translateY(-50%) translateX(var(--tx));
        background: var(--bg-raised);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1.25rem 1.4rem;
        opacity: 0;
        transition: opacity 0.45s ease, transform 0.45s ease;
    }

    .card.left  { --tx: -8px; }
    .card.right { --tx:  8px; }

    .card.visible {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
    }

    .card:hover { border-color: rgba(0, 200, 160, 0.3); }

    .role {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text);
        margin-bottom: 0.4rem;
    }

    .meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.3rem;
        margin-bottom: 0.9rem;
    }

    .company {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        color: var(--accent);
    }

    .sep   { color: var(--border); }

    .muted {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        color: var(--text-muted);
    }

    .bullets {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
    }

    .bullets li {
        font-size: 0.85rem;
        color: var(--text-muted);
        padding-left: 1rem;
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

    /* ── Mobile: drop SVG, stack cards ──────────────── */
    @media (max-width: 720px) {
        .track { display: none; }

        .stage {
            aspect-ratio: unset;
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