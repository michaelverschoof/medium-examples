<script setup>
import RecursiveComponent from '@/components/RecursiveComponent.vue';
import { ref } from 'vue';

const selected = ref([]);

const select = (character, level) => {
    selected.value[level] = character;
    selected.value.splice(level + 1);
};

const characters = [
    { name: 'Gandalf' },
    {
        name: 'Thranduil',
        children: [{ name: 'Legolas' }]
    },
    {
        name: 'Groin son of Farin',
        children: [
            {
                name: 'Gloin son of Groin',
                children: [{ name: 'Gimli son of Gloin' }]
            }
        ]
    }
];
</script>

<template>
    <main>
        <h1>Hello recursive components</h1>

        <div id="container">
            <recursive-component :characters="characters" :selected="selected" :level="0" @selected="select" />
        </div>
    </main>
</template>

<style>
#container {
    border: 2px solid #41b883;
    display: flex;
    margin: 0 auto;
    max-width: 800px;
}

ul,
li {
    list-style-type: none;
}
</style>
