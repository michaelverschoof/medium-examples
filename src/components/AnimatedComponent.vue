<script setup lang="ts">
import { onMounted, ref } from 'vue';

withDefaults(defineProps<{ animationType?: string }>(), { animationType: 'fade' });

const target = ref<Element>();
const animate = ref<boolean>(false);

const observer = new IntersectionObserver(
    ([entry]) => {
        animate.value = entry.isIntersecting;
    },
    {
        threshold: 0.5
    }
);

onMounted(() => {
    observer.observe(target.value as Element);
});
</script>

<template>
    <div ref="target">
        <transition :name="animationType">
            <div v-appear="animate" class="animated-component">
                <slot />
            </div>
        </transition>
    </div>
</template>

<style scoped>
.animated-component.fade-enter-from,
.animated-component.zoom-enter-from {
    transition: none;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Zoom animation */
.zoom-enter-active,
.zoom-leave-active {
    transition: transform 300ms ease;
}

.zoom-enter-from,
.zoom-leave-to {
    transform: scale(0.9);
}
</style>
