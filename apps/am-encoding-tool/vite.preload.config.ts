import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
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
