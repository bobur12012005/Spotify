import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                album: resolve(__dirname, 'pages/album/index.html'),
                artist: resolve(__dirname, 'pages/artist/index.html'),
                profile: resolve(__dirname, 'pages/profile/index.html'),
                search: resolve(__dirname, 'pages/search/index.html'),
                song: resolve(__dirname, 'pages/song/index.html'),
                login: resolve(__dirname, 'pages/login/index.html'),
            },
        },
    },
})