import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { Directive, DirectiveBinding, VNode } from 'vue';

export const appear: Directive = {
  beforeMount(element: HTMLElement) {
    element.style.visibility = 'hidden';
  },
  updated(element: HTMLElement, binding: DirectiveBinding<boolean>, node: VNode) {
    if (!binding.value === !binding.oldValue || null === node.transition) {
      return;
    }

    if (!binding.value) {
      node.transition.leave(element, () => {
        element.style.visibility = 'hidden';
      });
      return;
    }

    node.transition.beforeEnter(element);
    element.style.visibility = '';
    node.transition.enter(element);
  }
};

createApp(App)
.use(router)
.directive('appear', appear)
.mount('#app');
