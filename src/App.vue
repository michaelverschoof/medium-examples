<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';

const target = ref<Element>();
const sticking = ref<boolean>(false);

const observer = new IntersectionObserver(
    ([entry]) => {
        sticking.value = entry.isIntersecting;
    },
    { threshold: 0.0 }
);

onMounted(() => {
    observer.observe(target.value as Element);
});
</script>

<template>
    <div class="sticky-menu" :class="{ sticking }">This is our sticky menu</div>

    <div class="enable-scrolling" ref="target">
        <header>
            <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

            <div class="wrapper">
                <HelloWorld msg="You did it!" />

                <nav>
                    <RouterLink to="/">Home</RouterLink>
                    <RouterLink to="/about">About</RouterLink>
                </nav>
            </div>
        </header>

        <RouterView />
    </div>
</template>

<style scoped>
.sticky-menu {
    background-color: #41b883;
    padding: 1rem;
    position: sticky;
    top: 0;
    color: white;
    z-index: 1;
    grid-column-start: 1;
    grid-column-end: 3;
}

.sticky-menu.sticking {
    background-color: rgba(65, 184, 131, 0.3);
    box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.3);
}

.enable-scrolling {
    margin-top: 120vh;
    margin-bottom: 50vh;
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
