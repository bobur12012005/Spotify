import ApiHandler from "../../modules/http.request.js"
import { createLeftSidebar, createRightSidebar, createHeader, createFooter, createPlayer, reloadAlbumSongs } from "../../modules/ui.js"
import { getAverageRGB } from "../../assists/assist.js"

const PUBLIC_URL = new ApiHandler(import.meta.env.VITE_PUBLIC_URL)

let leftSidebar = document.querySelector('.left-sidebar')
let rightSidebar = document.querySelector('.right-sidebar')
let header = document.querySelector('header')
let footer = document.querySelector('footer')
let player = document.querySelector('.player')
let albumTitle = document.querySelector('.album-data span')
let albumImg = document.querySelector('.album-data img')
let albumSongsContainer = document.querySelector('.popular-songs-container')
let container = document.querySelector('.container')
let id = location.search.split('=').at(-1)

createLeftSidebar(leftSidebar)
createRightSidebar(rightSidebar)
createHeader(header)
createFooter(footer)

document.querySelector('#home-btn button').classList.remove('active-button')
document.querySelector('#home-btn button img').src = '/icons/home.svg'

PUBLIC_URL.getData(`/albums/${id}`)
    .then(album => {
        createPlayer(album.tracks.items, player)
        let playerImage = document.querySelector('.left-side-player .song-img img')
        let sidebarSongImg = document.querySelector('.right-sidebar .song-img img')
        albumImg.src = album.images[0].url

        albumTitle.innerHTML = album.name

        const img = new Image()
        img.crossOrigin = "Anonymous"

        img.onload = function () {
            var rgb = getAverageRGB(img)

            let blur = document.querySelector('.album-img-data-place')
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


        img.src = album.images[1].url
        playerImage.src = album.images[1].url
        sidebarSongImg.src = album.images[1].url

        reloadAlbumSongs(album.tracks.items, albumSongsContainer)
    })