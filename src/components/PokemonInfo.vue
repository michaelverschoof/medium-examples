<script setup lang="ts">
import { ref } from 'vue';
import { fetchPokemon } from '../api/fetch-pokemon';

const pokemon = ref<{ name: string }[]>([]);

// If this is true, the message in the temaplte is shown
const isTakingTooLong = ref(false);

async function getPokemon() {
    // Start the timeout
    const timeoutId = setTimeout(() => {
        // If the timeout isn't cleared in time, show the message
        isTakingTooLong.value = true;
    }, 3000);

    pokemon.value = await fetchPokemon();

    // Clear the timeout, cancelling it if it hasn't finished already
    clearTimeout(timeoutId);
}

// Call the function
getPokemon();
</script>

<template>
    <div>
        <!-- Show this message if the timeout is triggered -->
        <div v-if="isTakingTooLong" id="timeout-message">It's taking forever!</div>

        <div v-if="pokemon">
            <!-- Data is shown here -->
            <ul>
                <li v-for="item in pokemon">
                    {{ item.name }}
                </li>
            </ul>
        </div>
    </div>
</template>
