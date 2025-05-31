import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
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
