import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        // Fix for framer-motion dependency issues
        dedupe: ['framer-motion'],
    },
    optimizeDeps: {
        // Force pre-bundling of framer-motion to resolve dependency issues
        include: ['framer-motion'],
        esbuildOptions: {
            // Handle CommonJS modules in framer-motion
            target: 'es2020',
        },
    },
    build: {
        // Disable sourcemaps in production to avoid resolution errors
        // They're not needed in production and cause build warnings
        sourcemap: false,
        // CommonJS options for better compatibility
        commonjsOptions: {
            include: [/node_modules/],
            transformMixedEsModules: true,
        },
        // Improve chunking to reduce bundle sizes
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Separate vendor libraries into their own chunks
                    if (id.includes('node_modules')) {
                        // React and related
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react/jsx-runtime')) {
                            return 'react-vendor';
                        }
                        // Inertia
                        if (id.includes('@inertiajs')) {
                            return 'inertia-vendor';
                        }
                        // Radix UI components
                        if (id.includes('@radix-ui')) {
                            return 'ui-vendor';
                        }
                        // MUI (Material UI)
                        if (id.includes('@mui')) {
                            return 'mui-vendor';
                        }
                        // Framer Motion
                        if (id.includes('framer-motion')) {
                            return 'framer-motion-vendor';
                        }
                        // Large libraries that are used conditionally
                        if (id.includes('xlsx')) {
                            return 'xlsx-vendor';
                        }
                        if (id.includes('jspdf')) {
                            return 'jspdf-vendor';
                        }
                        if (id.includes('html2canvas')) {
                            return 'html2canvas-vendor';
                        }
                        // Other node_modules
                        return 'vendor';
                    }
                },
            },
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 1000,
    },
});
