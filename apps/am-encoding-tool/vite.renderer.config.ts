import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    optimizeDeps: {
        exclude: ['pg', 'pg-cloudflare', 'pg-native'],
    },
    build: {
        rollupOptions: {
            external: [
                'pg',
                'pg-native',
                'pg-cloudflare',
                'cloudflare:sockets',
                /^pg-.*$/,
                /pg$/,
            ],
        },
    },
});
