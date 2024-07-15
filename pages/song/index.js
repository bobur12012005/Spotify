import ApiHandler from "../../modules/http.request.js"
import { createLeftSidebar, createRightSidebar, createHeader, createFooter, reloadSongs, createPlayer, reloadArtistContent } from "../../modules/ui.js"
import { getAverageRGB } from "../../assists/assist.js"

const PUBLIC_URL = new ApiHandler(import.meta.env.VITE_PUBLIC_URL)

let leftSidebar = document.querySelector('.left-sidebar')
let rightSidebar = document.querySelector('.right-sidebar')
let header = document.querySelector('header')
let footer = document.querySelector('footer')
let player = document.querySelector('.player')
let id = location.search.split('=').at(-1)
let container = document.querySelector('.container')
let songImg = document.querySelector('.song-img-data-place .song-data img')
let songTitle = document.querySelector('.song-img-data-place .song-data span')
let recommendedSongsContainer = document.querySelector('.recommended-songs-container')

createLeftSidebar(leftSidebar)
createRightSidebar(rightSidebar)
createHeader(header)
createFooter(footer)

document.querySelector('#home-btn button').classList.remove('active-button')
document.querySelector('#home-btn button img').src = '/icons/home.svg'

PUBLIC_URL.getData(`/tracks/${id}`)
    .then(track => {
        songImg.src = track.album.images[0].url
        songTitle.innerHTML = track.name

        PUBLIC_URL.getData(`/artists/${track.artists[0].id}/top-tracks`)
            .then(res => {
                createPlayer(res.tracks, player)
            })

        PUBLIC_URL.getData(`/artists/${track.artists[0].id}/top-tracks`)
            .then(res => {
                reloadSongs(res.tracks, recommendedSongsContainer)
            })
        
        const img = new Image()
        img.crossOrigin = "Anonymous"

        img.onload = function () {
            var rgb = getAverageRGB(img)

            let blur = document.querySelector('.song-img-data-place')
            let blur2 = document.querySelector('.total-play-button-place')

            blur.style.background = `
                linear-gradient(
                    rgb(${rgb.r}, ${rgb.g}, ${rgb.b}),
                    rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)
                )
            `
            blur2.style.background = `
                    linear-gradient(
                         to top,
                         rgba(24, 24, 24, 0.8),
                         rgba(24, 24, 24, 0.7),
                         rgba(24, 24, 24, 0.6)
                    ),
                    linear-gradient(
                        to top,
                        rgba(24, 24, 24, 0.2),
                        rgb(${rgb.r}, ${rgb.g}, ${rgb.b})
                    )
                `
            container.addEventListener('scroll', () => {
                const scrollPosition = container.scrollTop

                if (scrollPosition > 240) {
                    document.querySelector('.inner-header').style.backgroundColor = '#00000080'
                    document.querySelector('.header').style.background = `
                                    linear-gradient(
                                        rgb(${rgb.r}, ${rgb.g}, ${rgb.b}),
                                        rgb(${rgb.r}, ${rgb.g}, ${rgb.b})
                                    )
                                `
                } else {
                    document.querySelector('.inner-header').style.backgroundColor = 'transparent'
                    document.querySelector('.header').style.background = 'none'
                }
            })
        }

        img.src = track.album.images[0].url
    })