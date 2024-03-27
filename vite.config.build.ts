import vue from '@vitejs/plugin-vue';
import { readFileSync } from 'fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, Plugin } from 'vite';

export default defineConfig({
    plugins: [vue(), prepareDeployServerIndex()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        outDir: `dist/widget`,
        // emptyOutDir: false,
        rollupOptions: {
            input: { widget: './main.ts' },
            output: {
                entryFileNames: (chunk) => `${chunk.name}.js`
            }
        }
    }
});

function prepareDeployServerIndex(): Plugin {
    return {
        name: 'prepare-preview-index',
        apply: 'build',
        generateBundle() {
            this.emitFile({
                type: 'asset',
                fileName: `index.html`,
                source: readFileSync('./index.preview.html', 'utf-8')
            });
        }
    };
}
