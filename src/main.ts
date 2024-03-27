import './assets/main.css';

import { createPinia } from 'pinia';
import { createApp, reactive } from 'vue';

import App from './App.vue';
import router from './router';
import { useCounterStore } from './stores/counter';

load();

function load() {
    const instanceParameters = reactive({});
    const windowObject = window;

    // Create the instance
    const instance = createInstance(windowObject);

    // Initialize the actual widget
    initialize(App, instance, instanceParameters, windowObject);

    // Process the method calls that are queued
    processQueue(instance, instanceParameters, windowObject);
}

function createInstance(windowObject) {
    const instanceName = getInstanceName(windowObject);

    // Get the loader object that comes from the initial script
    const loader = getLoader(windowObject, instanceName);

    const configuration = getConfiguration(loader, instanceName);

    // Get the remaining methods to execute
    const queue = loader.q.filter((queued) => 'init' !== queued[0]);

    return {
        name: instanceName,
        queue: queue,
        config: configuration
    };
}

function getInstanceName(windowObject) {
    const elements = windowObject.document.querySelectorAll('script[data-btcdirect]');
    if (!elements || !elements.length) {
        throw new Error('Failed to start Widget. No script elements found with the "data-btcdirect" attribute');
    }

    // If only one script is found, we'll assume it's the correct one.
    // Also serves as fallback for the development server as the src does not match.
    if (1 === elements.length) {
        const name = elements[0].dataset.btcdirect;

        // Check that the widget is not loaded twice under the same name
        if (windowObject[`loaded-${name}`]) {
            throw new Error(`Widget with name "${name}" was already loaded.`);
        }

        return name;
    }

    throw new Error('Failed to start Widget. Multiple script elements found with the "data-btcdirect" attribute');
}

/**
 * Get the widget instance from the window object.
 */
function getLoader(windowObject, instanceName) {
    const loader = windowObject[instanceName];

    // Check if there's a loader object and if it has a queue variable
    if (!loader || !loader.q || 0 === loader.q.length) {
        throw new Error(`Couldn't find the Widget instance "${instanceName}". The loading script was modified or no call to the "init" method was provided.`);
    }

    return loader;
}

/**
 * Get the merged default and user's configuration.
 */
function getConfiguration(loader, instanceName) {
    // Get the first queued method call
    const [name, config] = loader.q[0];

    // Check if the first method is init
    if ('init' !== name) {
        throw new Error(`Failed to start widget "${instanceName}". The first method call must be "init".`);
    }

    const defaultConfiguration = {
        theme: 'light'
    };

    // Merge the provided configuration with the default values, letting the provided values overwrite the default values
    return Object.assign(defaultConfiguration, config);
}

/**
 * Initialize the actual Vue instance.
 */
function initialize(component, instance, parameters, windowObject) {
    // Actually create and mount the app
    const app = createApp(component);

    app.use(createPinia());
    const counterStore = useCounterStore();
    counterStore.count = 5;

    app.use(router);

    app.provide('widgetMethodCalls', reactive(parameters));
    app.mount('#app');

    // Set the window variable, so we can check that the instance is loaded
    windowObject[`loaded-${instance.name}`] = true;
}

/**
 * Process the method calls in the queue and replace the window object with the sync method call afterwards
 */
function processQueue(instance, instanceParameters, windowObject) {
    for (const method of instance.queue) {
        const [methodName, methodParameters] = method;
        callMethod(methodName, methodParameters, instanceParameters, instance.config);
    }

    // Once we've finished processing all async calls, we're going to convert the LoaderObject into sync calls to methods
    synchronizeQueue(instance, instanceParameters, windowObject);
}

/**
 * Call a method from the registry if it's in the list
 */
function callMethod(methodName, methodParameters, instanceParameters, instanceConfiguration) {
    const callableMethods = { 'my-widget-call': myWidgetCall };

    if (!(methodName in callableMethods)) {
        console.warn(`Tried to call method "${methodName}" which is not available for this widget`);
        return;
    }

    console.debug(`Called method "${methodName}"`, 'Provided parameters: ' + JSON.stringify(methodParameters));

    // Actually call the method defined in the registry
    callableMethods[methodName](methodParameters, instanceParameters, instanceConfiguration);
}

function myWidgetCall(methodParameters, instanceParameters, instanceConfiguration) {
    console.log('myWidgetCall triggered!', methodParameters, instanceParameters, instanceConfiguration);
}

/**
 * Replace the object with the method queue with a method to handle any further calls
 */
function synchronizeQueue(instance, instanceParameters, windowObject) {
    windowObject[instance.name] = (methodName, methodParameters) => {
        callMethod(methodName, methodParameters, instanceParameters, instance.config);
    };
}
