<template>
    <div id="nav" ref="target">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
    </div>

    <div class="sticky-menu" :class="{ sticking }">
        This is our sticky menu
    </div>

    <router-view/>
</template>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-height: 150vh;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}

.sticky-menu {
    background-color: #41b883;
    padding: 1rem;
    position: sticky;
    top: 0;

    .sticking {
        background-color: rgba(65, 184, 131, 0.3);
        box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.3);
    }
}
</style>

<script lang="ts">
import {onMounted, ref} from 'vue';

export default {
    name: 'app',
    setup() {
        const target = ref();
        const sticking = ref(false);

        const observer = new IntersectionObserver(
            ([entry]) => {
                sticking.value = !entry.isIntersecting;
            },
            {threshold: 0.0}
        );

        onMounted(() => {
            observer.observe(target.value);
        });

        return {
            target,
            sticking
        };
    }
};
</script>
