<template>
  <div class="about">
    <h1>This is an about page</h1>

    <hr>
    <div>
      <h3>Global state</h3>
      <p>String value: {{ globalState.someString }}</p>
      <p>Boolean value: {{ globalState.someBoolean }}</p>
    </div>
    <div>
      <h3>Local state</h3>
      <p>String value: {{ localState.someString }}</p>
      <p>Boolean value: {{ localState.someBoolean }}</p>
    </div>
    <hr>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStatefulComposable } from '@/composables/stateful-composable';

export default defineComponent({
  name: 'About',
  setup() {
    const { globalState, localState } = useStatefulComposable();

    return {
      globalState,
      localState
    }
  }
});
</script>
