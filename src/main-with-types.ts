import type { Component } from 'vue';

interface WindowObject extends Window {
    [key: string]: any;
    navigator: WindowNavigator;
}

interface WindowNavigator extends Navigator {
    userLanguage?: string;
    userAgentData?: any; // TODO: Specify type
}

/**
 * Configuration that is used throughout the embeddables.
 */
interface Configuration {
    selector: string;
    enableUserIdentifier?: boolean;
    returnUrl?: string;
    useFullWidth?: boolean;
    useSameWindowForPayment?: boolean;
    theme?: 'light' | 'dark';
    version: 'v1' | 'v2';
}

/**
 * Configuration that can be provided during initialization of the embeddables.
 */
interface InstanceConfiguration extends Configuration {
    token: string;
    debug?: boolean;
    locale?: string;
    userIdentifier?: string;
    walletConfirmationRequired?: boolean;
    startInOverview?: boolean;
    hideFooter?: boolean;
    isUnifiedCheckout?: boolean;
}

/**
 * Represents the instance data
 */
export interface Instance {
    name: string;
    queue: MethodQueue;
    config: InstanceConfiguration;
}

/**
 * Options that can be provided during method calls.
 */
export interface MethodParameters extends Record<string, string | any> {
    theme?: 'light' | 'dark';
}

/** Represents the queue of methods passed from the client. */
type Queue = Array<[method: string, values: InstanceConfiguration | MethodParameters]>;

/** Represents the root properties for the embeddable. */
type RootProperties = Record<string, string | boolean>;

/** Represents a model that is created in embedded script as part of script initialization. */
interface Loader {
    /* Queue that accumulates method calls during downloading and loading of widget's script file */
    q: Queue;
}

export type MethodQueue = Array<[method: string, parameters: MethodParameters]>;

const initMethodName = 'init';

/**
 * Create the instance to use throughout the loader.
 * This gathers the initial loader object, merges the default configuration with the user's configuration and gets the method queue.
 */
export function createInstance(instanceType: InstanceTypes, windowObject: WindowObject): Instance {
    // Get the instance name from the originating script
    const instanceName = getInstanceName(instanceType, windowObject);

    // Get the loader object that comes from the initial script
    const loader = getLoader(windowObject, instanceName);

    // Get the merged configuration
    const configuration = getConfiguration(loader, instanceName, instanceType);

    // Set the locale
    setDefaultLocale(configuration, windowObject);

    // Get the remaining methods to execute
    const queue = getMethodQueue(loader);

    return {
        name: instanceName,
        queue: queue,
        config: configuration
    };
}

/**
 * Initialize the actual Vue instance.
 */
export function initialize(
    component: Component,
    instance: Instance,
    properties: RootProperties,
    parameters: MethodParameters,
    windowObject: WindowObject
): void {
    // Get the element to mount
    const element = getMountableElement(instance.config.selector);

    // Set the styling on the mountable element
    // TODO: Try to figure out a way to not need this
    setMountableElementHeight(element);

    // Set the configuration for the embeddable
    // TODO: Move this to config store
    setConfiguration(instance.config, windowObject);

    // Actually create and mount the app
    const app = createApp(component, properties);

    // Create and add the store
    const pinia = createPinia();
    app.use(pinia);

    // Set the configuration
    const configurationStore = useConfigurationStore();
    configurationStore.setInstanceConfiguration({
        appTargetSelector: instance.config.selector,
        theme: instance.config.theme,
        walletConfirmationRequired: instance.config.walletConfirmationRequired,
        hideFooter: instance.config.hideFooter
    });

    configurationStore.setUnifiedCheckout(instance.config.isUnifiedCheckout ?? false);

    // Set the translations
    const i18n = setupI18n(instance.config.locale);
    app.use(i18n);

    // Set the client token
    const authenticationStore = useAuthenticationStore();
    authenticationStore.setClientToken(instance.config.token);

    // Set the user identifier
    if (!!instance.config.userIdentifier) {
        authenticationStore.setUserTokens({ identifier: instance.config.userIdentifier });
    }

    // Add Sentry logging
    // Setup Sentry error logging
    initializeSentry(app, instance.config.type);

    app.provide<MethodParameters>(MethodCallParametersSymbol, reactive(parameters));
    app.mount(element);

    // Set the window variable, so we can check that the instance is loaded
    windowObject[`loaded-${instance.name}`] = true;

    debug(`Finished initialization of widget "${instance.name}"`);
}

/**
 * Add configuration based on window parameters.
 */
export function processWindowConfiguration(instance: Instance, windowObject: WindowObject): void {
    // If no explicit return url has been provided, we'll use the window location
    if (!instance.config.returnUrl) {
        instance.config.returnUrl = windowObject.location.origin + windowObject.location.pathname;
    }
}

/**
 * Find the script element that initialized this embeddable.
 * This is done by finding the script elements with the "data-btcdirect" attribute, filtering out the name from its source and returning the ID.
 *
 * Example: <script id="btcdirect-f2c" src="<url-to-cdn/fiat-to-coin.js" data-btcdirect> matches the type "fiat-to-coin" and returns "btcdirect-f2c".
 */
function getInstanceName(type: InstanceTypes, windowObject: WindowObject): string {
    const elements = windowObject.document.querySelectorAll('script[data-btcdirect]') as NodeListOf<HTMLScriptElement>;
    if (!elements || !elements.length) {
        throw new Error('Failed to start Widget. No script elements found with the "data-btcdirect" attribute');
    }

    // If only one script is found, we'll assume it's the correct one. Also serves as fallback for the development server as the src does not match.
    if (1 === elements.length) {
        const name = getNameFromDatasetOrID(elements[0]);
        return validateInstanceName(name, windowObject);
    }

    // Find the element where the type matches the script name
    const scriptElement = Array.from(elements).find((element) => {
        const start = element.src.lastIndexOf('/') + 1;
        return type === element.src.slice(start, start + type.length);
    });

    if (!scriptElement) {
        throw new Error(`Failed to start Widget. No script element found with type "${type}"`);
    }

    const name = getNameFromDatasetOrID(scriptElement);
    return validateInstanceName(name, windowObject);
}

/**
 * Get the name from either the data-btcdirect attribute or the ID attribute as a fallback
 */
function getNameFromDatasetOrID(element: HTMLScriptElement): string {
    const datasetName = element.dataset.btcdirect;
    if (!!datasetName) {
        return datasetName;
    }

    const idName = element.id;
    if (!!idName) {
        return idName;
    }

    throw new Error('Could not determine widget name but dataset or ID');
}

/**
 * Check if the instance name hasn't been loaded.
 */
function validateInstanceName(name: string, windowObject: WindowObject): string {
    // Check that the widget is not loaded twice under the same name
    if (windowObject[`loaded-${name}`]) {
        throw new Error(`Widget with name "${name}" was already loaded.`);
    }

    return name;
}

/**
 * Get the widget instance from the window object.
 */
function getLoader(windowObject: WindowObject, instanceName: string): Loader {
    const loader: Loader = windowObject[instanceName];

    // Check if there's a loader object and if it has a queue variable
    if (!loader || !loader.q || 0 === loader.q.length) {
        throw new Error(`Widget couldn't find the instance "${instanceName}". The loading script was modified or no call to the "init" method was provided.`);
    }

    return loader;
}

/**
 * Get the merged default and user's configuration.
 */
function getConfiguration(loader: Loader, instanceName: string, instanceType: InstanceTypes): InstanceConfiguration {
    // Get the first queued method call
    const [name, config] = loader.q[0] as [method: string, configuration: InstanceConfiguration];

    // Check if the first method is init
    if (initMethodName !== name) {
        throw new Error(`Failed to start widget "${instanceName}". The first method must be "${initMethodName}".`);
    }

    // Check if the init params contain a token
    if (!config.token) {
        throw new Error(`Failed to start widget "${instanceName}". The '${initMethodName}' method should include a client token.`);
    }

    const defaultConfiguration: Configuration = {
        enableUserIdentifier: false,
        returnUrl: null,
        selector: '.btcdirect-widget',
        theme: 'light',
        useFullWidth: false,
        useSameWindowForPayment: true,
        type: instanceType,
        version: 'v1'
    };

    // Merge the provided configuration with the default values, letting the provided values overwrite the default values
    return Object.assign(defaultConfiguration, config);
}

/**
 * Set the application configuration.
 */
function setConfiguration(instanceConfiguration: InstanceConfiguration, windowObject: WindowObject): void {
    const { set, keys } = useConfiguration();

    const config = keys
        .filter((key) => key !== 'useFullWidth')
        .reduce((configuration: Configuration, key: string) => {
            configuration[key] = instanceConfiguration[key];
            return configuration;
        }, {} as Configuration);

    config.useFullWidth = getFullWidthOption(instanceConfiguration, windowObject);

    set(config);
}

/**
 * Set the locale based on the provided configuration. If no initial value is provided, use the window language.
 */
function setDefaultLocale(configuration: InstanceConfiguration, windowObject: WindowObject): void {
    setLocale(configuration.locale || windowObject.navigator.language || windowObject.navigator.userLanguage);
}

/**
 * Filter all calls to the init method, leaving the method calls
 */
function getMethodQueue(loader: Loader): MethodQueue {
    return loader.q.filter((queued) => initMethodName !== queued[0]) as MethodQueue;
}

function getFullWidthOption(config: InstanceConfiguration, windowObject: WindowObject): boolean {
    const laptopScreenWidth = 1024;
    return laptopScreenWidth > windowObject.innerWidth ? false : config.useFullWidth;
}

/**
 * Try and find an element to mount the app on using the provided selector.
 * If no selector is provided, or it doesn't result in an element, try to find default elements.
 *
 * @param {string} selector the CSS selector used to locate the element
 */
function getMountableElement(selector: string): HTMLElement {
    const element = document.querySelector(selector) as HTMLElement;

    // If the element could not be found, we have to stop the application with an error
    if (!element) {
        throw new Error(`Widget with selector "${selector}" could not be found.`);
    }

    return element;
}

/**
 * Set an explicit height to the widget mountable element.
 * If no explicit height is found (f.e. 100%, 50rem, etc) then overriding is necessary.
 */
function setMountableElementHeight(element: HTMLElement): void {
    if (!/(px|em|vm|vh|vw|%)/.test(element.style.height)) {
        element.style.height = '100%';
    }
}
