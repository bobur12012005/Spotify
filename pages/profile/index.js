import ApiHandler from "../../modules/http.request.js"
import { createLeftSidebar, createRightSidebar, createHeader, createFooter, createPlayer, reloadArtistContent, reloadSongs } from "../../modules/ui.js"
import { getAverageRGB } from "../../assists/assist.js"

const PUBLIC_URL = new ApiHandler(import.meta.env.VITE_PUBLIC_URL)

let leftSidebar = document.querySelector('.left-sidebar')
let rightSidebar = document.querySelector('.right-sidebar')
let header = document.querySelector('header')
let footer = document.querySelector('footer')
let player = document.querySelector('.player')
let userImg = document.querySelector('.user-data img')
let userName = document.querySelector('.user-data span')
let container = document.querySelector('.container')
let artistContentContainer = document.querySelector('.made-for-user-container')
let topSongsContainer = document.querySelector('.popular-songs-container')

createLeftSidebar(leftSidebar)
createRightSidebar(rightSidebar)
createHeader(header)
createFooter(footer)

document.querySelector('#home-btn button').classList.remove('active-button')
document.querySelector('#home-btn button img').src = '/icons/home.svg'

PUBLIC_URL.getData('/me')
    .then(me => {
        if (me.images.length > 0) {
            userImg.src = me.images[1].url
        } else {
            userImg.src = '/images/user.jpg'
        }

        userName.innerHTML = me.display_name

        const img = new Image()
        img.crossOrigin = "Anonymous"

        img.onload = function () {
            var rgb = getAverageRGB(img)

            let blur = document.querySelector('.user-img-data-place')
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

        img.src = me.images[1].url
    })

let uniqueArtistIdsArray = []

PUBLIC_URL.getData('/me/playlists')
    .then(playlist => {
        PUBLIC_URL.getData(`/playlists/${playlist.items[0].id}/tracks`)
            .then(tracks => {
                let artistIds = tracks.items.map(track => track.track.artists[0].id)
                let uniqueArtistIds = [...new Set(artistIds)]
                uniqueArtistIdsArray.push(...uniqueArtistIds)

                PUBLIC_URL.getData(`/artists?ids=${uniqueArtistIdsArray}`)
                    .then(response => {
                        let artists = response.artists
                        reloadArtistContent(artists.splice(0, 4), artistContentContainer)

                        PUBLIC_URL.getData(`/artists/${artists[7].id}/top-tracks`)
                            .then(res => {
                                createPlayer(res.tracks.splice(0, 4), player)
                            })
                        PUBLIC_URL.getData(`/artists/${artists[7].id}/top-tracks`)
                            .then(res => {
                                reloadSongs(res.tracks.splice(0, 4), topSongsContainer)
                            })
                    })
            })
    })