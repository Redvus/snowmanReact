import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // sourcemap: true, // Add sourcemap
        outDir: "./dist/", // Output in the dist/ folder
        // emptyOutDir: true, // Empty the folder first
        rollupOptions: {
            output: {
                // chunkFileNames: 'assets/js/[name]-[hash].js',
                // entryFileNames: 'assets/js/[name]-[hash].js',
                chunkFileNames: "app-min.js",
                entryFileNames: "app-min.js",

                assetFileNames: ({ names }) => {
                    const name = names?.join("") ?? "";
                    if (/\.(gif|jpg|jpe?g|png|svg)$/.test(name)) {
                        return "images/[name][extname]";
                    }

                    if (/\.css$/.test(name)) {
                        return "app.css";
                    }

                    // if (/\.(woff|woff2)$/.test(name ?? '')) {
                    //     return 'fonts/[name]/[name][extname]';
                    // }

                    // default value
                    // ref: https://rollupjs.org/guide/en/#outputassetfilenames
                    return "[name]-[hash][extname]";
                },
            }
        },
    },
})
