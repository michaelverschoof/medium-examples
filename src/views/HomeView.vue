<script setup lang="ts">
import { useStatefulComposable } from '@/composables/stateful-composable';

const { globalState, localState, updateValues } = useStatefulComposable();
</script>

<template>
    <main>
        <div>
            <h3>Global state</h3>
            <p>String value: {{ globalState.someString }}</p>
            <p>Boolean value: {{ globalState.someBoolean }}</p>
        </div>
        <br />
        <hr />
        <br />
        <div>
            <h3>Local state</h3>
            <p>String value: {{ localState.someString }}</p>
            <p>Boolean value: {{ localState.someBoolean }}</p>
        </div>
        <br />
        <button type="button" @click="updateValues('Updated value through button', true)">Click me to update the values</button>
    </main>
</template>
