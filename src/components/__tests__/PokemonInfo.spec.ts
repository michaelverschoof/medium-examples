import { mount } from '@vue/test-utils';
import { expect, test, vi } from 'vitest';
import * as api from '../../api/fetch-pokemon';
import PokemonInfo from '../PokemonInfo.vue';

test('Shows a message when the API call takes more than 3 seconds', async () => {
    // Use Vitest's fake timers so we can manipulate time
    vi.useFakeTimers();

    // Spy on our function and substitute the implementation
    // with our delayed version
    vi.spyOn(api, 'fetchPokemon').mockImplementation(async () => {
        // Wait for 3,5 seconds before returning an empty arry
        // This delay is more than 3 seconds so the message triggers
        await new Promise((resolve) => setTimeout(resolve, 3500));
        return [];
    });

    // Mount the component. This automatically triggers the call to the API.
    const wrapper = mount(PokemonInfo);

    // Resolve all open triggers.
    // This makes our timeout trigger so the message is shown.
    vi.runAllTimers();

    // Await the virtual machine to update the template
    await wrapper.vm.$nextTick();

    // Find the message and check the text
    const message = wrapper.find('#timeout-message');
    expect(message.exists()).toBe(true);
    expect(message.text()).toBe("It's taking forever!");

    // Restore real timers so other tests aren't affected
    vi.useRealTimers();
});
