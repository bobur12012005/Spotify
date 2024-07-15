import ApiHandler from "../../modules/http.request.js"
import { createLeftSidebar, createRightSidebar, createHeader, createFooter, reloadSongs, createPlayer, reloadArtistContent } from "../../modules/ui.js"

const PUBLIC_URL = new ApiHandler(import.meta.env.VITE_PUBLIC_URL)

let leftSidebar = document.querySelector('.left-sidebar')
let rightSidebar = document.querySelector('.right-sidebar')
let header = document.querySelector('header')
let footer = document.querySelector('footer')
let player = document.querySelector('.player')
let resultImg = document.querySelector('.result-img img')
let resultName = document.querySelector('.result-name')
let resultType = document.querySelector('.result-type')
let songsContainer = document.querySelector('.other-results-container')
let topResultLink = document.querySelector('.results-link')
let userFollowingsContainer = document.querySelector('.user-followings-container')
let searchResults = document.querySelector('.results')

createLeftSidebar(leftSidebar)
createRightSidebar(rightSidebar)
createHeader(header)
createFooter(footer)
createPlayer([], player)

document.querySelector('#home-btn button').classList.remove('active-button')
document.querySelector('#home-btn button img').src = '/icons/home.svg'

let searchPlace = document.querySelector('header .search-place')
searchPlace.style.display = 'flex'

let search = document.querySelector('header .search-input')

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
                        reloadArtistContent(artists, userFollowingsContainer)
                    })
            })
    })

search.onkeyup = () => {
    let searchTerm = search.value.trim();
    userFollowingsContainer.parentElement.style.display = searchTerm === '' ? 'block' : 'none'
    searchResults.style.display = searchTerm === '' ? 'none' : 'flex'

    if (searchTerm !== '') {
        PUBLIC_URL.getData(`/search?q=${searchTerm}&type=artist%2Ctrack%2Calbum%2Caudiobook%2Cepisode%2Cshow`)
            .then(res => {
                let topArtist = res.artists.items[0]
                resultImg.src = topArtist.images[0].url
                resultName.innerHTML = topArtist.name
                resultType.innerHTML = topArtist.type
                topResultLink.href = `/pages/artist/index.html?id=${topArtist.id}`

                reloadSongs(res.tracks.items.slice(0, 4), songsContainer)
            })
    }
}

document.querySelector('#home-btn button').classList.remove('active-button')
document.querySelector('#home-btn button img').src = '/icons/home.svg'
document.querySelector('#search-btn button').classList.add('active-button')
document.querySelector('#search-btn button img').src = '/icons/search-active.svg'