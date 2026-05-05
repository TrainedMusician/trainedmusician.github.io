<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import BackToTop from '$lib/components/BackToTop.svelte';
  import { personal } from '$lib/data/cv';

  let { children } = $props();

  const year = new Date().getFullYear();
</script>

<Nav />

{@render children()}

<BackToTop />
