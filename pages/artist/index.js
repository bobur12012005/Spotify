import axios from "axios"
import ApiHandler from "../../modules/http.request.js"
import { createLeftSidebar, createRightSidebar, createHeader, createFooter, reloadSongs, createPlayer, reloadAlbumContent } from "../../modules/ui.js"
import { getAverageRGB } from "../../assists/assist.js"

const PUBLIC_URL = new ApiHandler(import.meta.env.VITE_PUBLIC_URL)

let leftSidebar = document.querySelector('.left-sidebar')
let rightSidebar = document.querySelector('.right-sidebar')
let header = document.querySelector('header')
let footer = document.querySelector('footer')
let artistImg = document.querySelector('.artist-img-place')
let artistName = document.querySelector('.artist-name')
let artistFollowers = document.querySelector('.followers-amount strong')
let songsContainer = document.querySelector('.popular-songs-container')
let player = document.querySelector('.player')
let container = document.querySelector('.container')
let artistAlbumContainer = document.querySelector('.popular-releases-container')
let seeMoreBtn = document.querySelector('.see-more')

createLeftSidebar(leftSidebar)
createRightSidebar(rightSidebar)
createHeader(header)
createFooter(footer)

document.querySelector('#home-btn button').classList.remove('active-button')
document.querySelector('#home-btn button img').src = '/icons/home.svg'

let id = location.href.split('=').at(-1)

PUBLIC_URL.getData(`/artists/${id}`)
    .then(artist => {
        const imageUrl = artist.images[0].url
        artistName.innerHTML = artist.name
        artistFollowers.innerHTML = artist.followers.total.toLocaleString()
        artistImg.style.backgroundImage = `url(${imageUrl})`

        const img = new Image()

        img.crossOrigin = "Anonymous"

        img.onload = function () {
            var rgb = getAverageRGB(img)

            let blur = document.querySelector('.total-play-button-place')

            blur.style.background = `
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

        img.src = imageUrl
    })

PUBLIC_URL.getData(`/artists/${id}/top-tracks`)
    .then(res => {
        createPlayer(res.tracks, player)
    })

PUBLIC_URL.getData(`/artists/${id}/top-tracks`)
    .then(res => {
        reloadSongs(res.tracks.slice(0, 5), songsContainer)
    })

seeMoreBtn.onclick = () => {
    seeMoreBtn.classList.toggle('active')

    if (seeMoreBtn.classList.contains('active')) {
        PUBLIC_URL.getData(`/artists/${id}/top-tracks`)
            .then(res => {
                reloadSongs(res.tracks, songsContainer)
                seeMoreBtn.innerHTML = 'See Less'
            })
    } else {
        PUBLIC_URL.getData(`/artists/${id}/top-tracks`)
            .then(res => {
                reloadSongs(res.tracks.slice(0, 5), songsContainer)
                seeMoreBtn.innerHTML = 'See More'
            })
    }
}

PUBLIC_URL.getData(`/artists/${id}/albums`)
    .then(res => {
        reloadAlbumContent(res.items.slice(0, 8), artistAlbumContainer)
    })