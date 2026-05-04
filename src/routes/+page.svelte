<script lang="ts">
    import Hero from '$lib/components/Hero.svelte';
    import Skills from '$lib/components/Skills.svelte';
    import Timeline from '$lib/components/Timeline.svelte';
    import Contact from '$lib/components/Contact.svelte';
    import {personal} from '$lib/data/cv';
    import favicon from './doggy.png';
</script>

<svelte:head>
    <title>{personal.name} a {personal.title}</title>
    <link rel="icon" href={favicon}/>
    <meta name="description" content="Personal portfolio of {personal.name}, a {personal.title}."/>
</svelte:head>

<main>
    <Hero/>
    <Skills/>
    <Timeline/>
    <Contact/>
</main>

<style>
    main {
        /* Sections handle their own padding.
           This wrapper just ensures stacking order. */
    }
</style>
