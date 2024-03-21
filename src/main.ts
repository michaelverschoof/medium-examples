import { createPinia } from 'pinia';
import { createApp, type Directive, type DirectiveBinding, type VNode } from 'vue';
import './assets/main.css';

import App from './App.vue';
import router from './router';

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

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.directive('appear', appear);

app.mount('#app');
