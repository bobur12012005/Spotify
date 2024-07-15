import ApiHandler from "./modules/http.request.js"
import { createLeftSidebar, createRightSidebar, createHeader, createFooter, reloadFollowing, reloadAlbumContent, reloadArtistContent, createPlayer } from "./modules/ui.js"

const PUBLIC_URL = new ApiHandler(import.meta.env.VITE_PUBLIC_URL)
const hash = location.hash
const token = localStorage.getItem('token')

if (!token && hash) {
    let token = hash.split('=')[1]

    localStorage.setItem('token', token)
    location.href = ""
}

let leftSidebar = document.querySelector('.left-sidebar')
let rightSidebar = document.querySelector('.right-sidebar')
let header = document.querySelector('header')
let footer = document.querySelector('footer')
let followingContainer = document.querySelector('.following-singers-container')
let contentAlbumsContainer = document.querySelector('.made-for-user-container')
let contentArtistsContainer = document.querySelector('.your-favorite-artists-container')
let nameSpan = document.querySelector('.made-for-user .boxes-top span')
let player = document.querySelector('.player')
let showAllBtn1 = document.querySelector('.show-all-1')
let showAllBtn2 = document.querySelector('.show-all-2')

createLeftSidebar(leftSidebar)
createRightSidebar(rightSidebar)
createHeader(header)
createFooter(footer)
createPlayer([], player)

PUBLIC_URL.getData('/me')
    .then(me => {
        nameSpan.innerHTML = 'Made For ' + me.display_name
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
                        reloadFollowing(artists.splice(0, 8), followingContainer)
                    })

                PUBLIC_URL.getData(`/artists?ids=${uniqueArtistIdsArray}`)
                    .then(response => {
                        let artists = response.artists
                        reloadArtistContent(artists.splice(0, 4), contentArtistsContainer)
                    })

                showAllBtn2.onclick = () => {
                    showAllBtn2.classList.toggle('active')

                    if (showAllBtn2.classList.contains('active')) {
                        PUBLIC_URL.getData(`/artists?ids=${uniqueArtistIdsArray}`)
                            .then(response => {
                                let artists = response.artists
                                reloadArtistContent(artists, contentArtistsContainer)
                                showAllBtn2.innerHTML = 'Show Less'
                            })
                    } else {
                        PUBLIC_URL.getData(`/artists?ids=${uniqueArtistIdsArray}`)
                            .then(response => {
                                let artists = response.artists
                                reloadArtistContent(artists.splice(0, 4), contentArtistsContainer)
                                showAllBtn2.innerHTML = 'Show All'
                            })
                    }
                }
            })
    })

PUBLIC_URL.getData(`/browse/new-releases`)
    .then(res => {
        let albums = res.albums.items
        let sortedAlbums = []

        albums.forEach(album => {
            if (album.total_tracks >= 10) {
                sortedAlbums.push(album)
            }
        })

        reloadAlbumContent(sortedAlbums.splice(0, 4), contentAlbumsContainer)
    })

showAllBtn1.onclick = () => {
    showAllBtn1.classList.toggle('active')

    if (showAllBtn1.classList.contains('active')) {
        PUBLIC_URL.getData(`/browse/new-releases`)
            .then(res => {
                let albums = res.albums.items
                let sortedAlbums = []

                albums.forEach(album => {
                    if (album.total_tracks >= 10) {
                        sortedAlbums.push(album)
                    }
                })

                reloadAlbumContent(sortedAlbums, contentAlbumsContainer)
            })
        showAllBtn1.innerHTML = 'Show Less'
    } else {
        PUBLIC_URL.getData(`/browse/new-releases`)
            .then(res => {
                let albums = res.albums.items
                let sortedAlbums = []

                albums.forEach(album => {
                    if (album.total_tracks >= 10) {
                        sortedAlbums.push(album)
                    }
                })

                reloadAlbumContent(sortedAlbums.splice(0, 4), contentAlbumsContainer)
            })
        showAllBtn1.innerHTML = 'Show All'
    }
}