<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>

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
    <button type="button" @click="updateValues('Updated value through button', true)">Click me to update the values</button>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { useStatefulComposable } from '@/composables/stateful-composable';

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },
  setup() {
    const { globalState, localState, updateValues } = useStatefulComposable();

    return {
      globalState,
      localState,
      updateValues
    }
  }
});
</script>
