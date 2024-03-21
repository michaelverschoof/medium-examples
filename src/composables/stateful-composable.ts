import { reactive } from 'vue';

const globalState = reactive({
    someString: 'Initial value',
    someBoolean: false
});

export const useStatefulComposable = () => {
    const localState = reactive({
        someString: 'Initial value',
        someBoolean: false
    });

    const updateValues = (stringValue: string, booleanValue: boolean) => {
        // Set the global state values
        globalState.someString = stringValue;
        globalState.someBoolean = booleanValue;

        // Set the local state values
        localState.someString = stringValue;
        localState.someBoolean = booleanValue;
    };

    return {
        globalState,
        localState,
        updateValues
    };
};
