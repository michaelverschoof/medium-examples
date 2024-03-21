<script setup lang="ts">
import { useStatefulComposable } from '@/composables/stateful-composable';

const { globalState, localState } = useStatefulComposable();
</script>

<template>
    <div class="about">
        <h1>This is an about page</h1>
        <br />
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
    </div>
</template>
