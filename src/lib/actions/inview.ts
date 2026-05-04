import type { Action } from 'svelte/action';

/**
 * Adds the `in-view` class to the element once it enters the viewport.
 * Works together with the `.reveal` CSS class in app.css.
 *
 * Usage:  <div class="reveal" use:inview>...</div>
 */
export const inview: Action = (node) => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('in-view');
        observer.disconnect();
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
};
