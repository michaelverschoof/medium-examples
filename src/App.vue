<script setup lang="ts">
import AnimatedComponent from '@/components/AnimatedComponent.vue';
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
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

    <div class="demo-container">
        <animated-component>
            <div class="demo">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque molestie nisl ac suscipit. Maecenas in auctor ligula. Vestibulum
                suscipit mi eget risus aliquet, id lacinia elit consectetur. Donec a tincidunt justo. Etiam varius urna et finibus lacinia. Vestibulum id auctor
                urna. Integer non facilisis urna. Nullam dapibus, sem in blandit posuere, sapien sem rhoncus urna, ac placerat massa sem tempor nisi.
            </div>
        </animated-component>

        <animated-component animation-type="zoom">
            <div class="demo">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque molestie nisl ac suscipit. Maecenas in auctor ligula. Vestibulum
                suscipit mi eget risus aliquet, id lacinia elit consectetur. Donec a tincidunt justo. Etiam varius urna et finibus lacinia. Vestibulum id auctor
                urna. Integer non facilisis urna. Nullam dapibus, sem in blandit posuere, sapien sem rhoncus urna, ac placerat massa sem tempor nisi.
                <br /><br />
                Vivamus eget nulla ut nisl venenatis lobortis non quis tellus. Nullam eget ornare tortor. Donec ac erat eget massa dapibus condimentum. Nunc sed
                nisi vel quam facilisis pharetra nec at lectus. Nam ipsum sem, auctor vel varius quis, fringilla non magna. Cras id magna velit. Nam faucibus mi
                massa, ac posuere nulla elementum at. Duis eget felis vitae nisl aliquet tempor. Vivamus nec porta purus.
            </div>
        </animated-component>
    </div>
</template>

<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
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

.demo {
    color: white;
    max-width: 600px;
    border: 2px solid #9dd3ba;
    padding: 2rem;
    margin: 2rem auto;
    background-color: #42b983;
}

.demo-container {
    min-height: 100vh;
    padding: 50vh 0;
}
</style>
