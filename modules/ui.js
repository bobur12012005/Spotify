import ApiHandler from "./http.request.js"
import "./ui-css/left-sidebar.css"
import "./ui-css/right-sidebar.css"
import "./ui-css/header.css"
import "./ui-css/footer.css"
import "./ui-css/artist.css"
import "./ui-css/following.css"
import "./ui-css/content-album.css"
import "./ui-css/content-artist.css"
import "./ui-css/song.css"
import "./ui-css/album-song.css"
import "./ui-css/player.css"
import { formatTime, createButton, millisToMinutesAndSeconds, shuffleSongs } from "../assists/assist.js"

const PUBLIC_URL = new ApiHandler(import.meta.env.VITE_PUBLIC_URL)
const token = localStorage.getItem('token')

export function createLeftSidebar(place) {
    let leftSidebarTop = document.createElement('div')
    let homeButton = document.createElement('a')
    let homeButtonContent = document.createElement('button')
    let homeIcon = document.createElement('img')
    let homeText = document.createElement('span')
    let searchButton = document.createElement('a')
    let searchButtonContent = document.createElement('button')
    let searchIcon = document.createElement('img')
    let searchText = document.createElement('span')
    let leftSidebarBottom = document.createElement('div')
    let libraryController = document.createElement('div')
    let libraryButton = document.createElement('button')
    let libraryIcon = document.createElement('img')
    let librarySearchButton = document.createElement('button')
    let librarySearchIcon = document.createElement('img')
    let singersContainer = document.createElement('div')
    let searchInput = document.createElement('input')

    homeButtonContent.classList.add('active-button')
    leftSidebarTop.classList.add('left-sidebar-top')
    leftSidebarBottom.classList.add('left-sidebar-bottom')
    libraryController.classList.add('library-controller')
    libraryButton.classList.add('library')
    librarySearchButton.classList.add('library-search')
    singersContainer.classList.add('singers-container')
    searchInput.classList.add('search-input')

    homeIcon.src = '/icons/home-active.svg'
    searchIcon.src = '/icons/search.svg'
    librarySearchIcon.src = '/icons/srch.svg'
    libraryIcon.src = '/icons/library-active.svg'

    homeText.innerHTML = 'Home'
    searchText.innerHTML = 'Search'

    homeButton.id = 'home-btn'
    searchButton.id = 'search-btn'

    searchButton.href = '/pages/search/'
    homeButton.href = '/'

    searchInput.placeholder = 'Library Search'

    homeButtonContent.append(homeIcon, homeText)
    homeButton.append(homeButtonContent)
    searchButtonContent.append(searchIcon, searchText)
    searchButton.append(searchButtonContent)
    leftSidebarTop.append(homeButton, searchButton)
    libraryButton.append(libraryIcon)
    libraryController.append(libraryButton, searchInput, librarySearchButton)
    librarySearchButton.append(librarySearchIcon)
    leftSidebarBottom.append(libraryController, singersContainer)
    place.append(leftSidebarTop, leftSidebarBottom)

    let buttons = [homeButtonContent, searchButtonContent]

    buttons.forEach(btn => {
        btn.onclick = () => {
            if (!btn.classList.contains('active-button')) {
                buttons.forEach(button => {
                    button.classList.remove(('active-button'))
                })
                btn.classList.add('active-button')
            }

            if (homeButtonContent.classList.contains('active-button')) {
                homeIcon.src = '/icons/home-active.svg'
            } else {
                homeIcon.src = '/icons/home.svg'
            }

            if (searchButtonContent.classList.contains('active-button')) {
                searchIcon.src = '/icons/search-active.svg'
            } else {
                searchIcon.src = '/icons/search.svg'
            }
        }
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
                            reloadArtists(artists, singersContainer)

                            searchInput.onkeyup = (e) => {
                                let key_word = e.target.value.trim().toLowerCase()
                                let a = artists.filter(names => {
                                    let title = names.name.toLowerCase()
                                    return title.includes(key_word)
                                })
                                reloadArtists(a, singersContainer)
                            }
                        })
                })
        })

    singersContainer.addEventListener('scroll', () => {
        const scrollPosition = singersContainer.scrollTop

        if (scrollPosition > 1) {
            libraryController.style.boxShadow = '0px 6px 6px -1px'
        } else {
            libraryController.style.boxShadow = 'none'
        }
    })
}

let rightSidebar = document.querySelector('.right-sidebar')

export function createRightSidebar(place) {
    let mainContainer = document.createElement('div')
    let rightContainerTop = document.createElement('div')
    let singerNameLink = document.createElement('a')
    let closeButton = document.createElement('button')
    let closeIcon = document.createElement('img')
    let songData = document.createElement('div')
    let songImg = document.createElement('div')
    let songImage = document.createElement('img')
    let songTitleNameAdd = document.createElement('div')
    let titleName = document.createElement('div')
    let songTitleLink = document.createElement('a')
    let singerNameLink2 = document.createElement('a')
    let addButton = document.createElement('button')
    let addIcon = document.createElement('img')
    let aboutTheArtist = document.createElement('div')
    let singerImg = document.createElement('div')
    let singerImgOver = document.createElement('div')
    let singerImageLink = document.createElement('a')
    let singerPersonalData = document.createElement('div')
    let singerNameLink3 = document.createElement('a')
    let listeners = document.createElement('div')
    let listenersText = document.createElement('span')
    let unfollowButton = document.createElement('button')
    let descriptionParagraph = document.createElement('p')
    let description = document.createElement('span')
    let descriptionLink = document.createElement('a')

    singerNameLink.innerHTML = 'Singer Name'
    songTitleLink.innerHTML = 'Song Title'
    singerNameLink2.innerHTML = 'Singer Name'
    singerImageLink.innerHTML = 'About the artist'
    singerNameLink3.innerHTML = 'Singer Name'
    listenersText.innerHTML = '0 <br> followers'
    unfollowButton.innerHTML = 'Unfollow'
    descriptionLink.innerHTML = 'Singer Name'
    description.innerHTML = ' description'

    rightContainerTop.classList.add('right-container-top')
    songData.classList.add('song-data')
    songImg.classList.add('song-img')
    songTitleNameAdd.classList.add('song-title-name-add')
    titleName.classList.add('title-name')
    songTitleLink.classList.add('song-title')
    singerNameLink2.classList.add('singer-name')
    aboutTheArtist.classList.add('about-the-artist')
    singerImg.classList.add('singer-img')
    singerImgOver.classList.add('singer-img-over')
    singerPersonalData.classList.add('singer-personal-data')
    listeners.classList.add('listeners')
    singerNameLink.classList.add('sidebar-artist-names')
    singerNameLink2.classList.add('sidebar-artist-names')
    singerNameLink3.classList.add('sidebar-artist-names')
    descriptionLink.classList.add('sidebar-artist-names')

    singerNameLink.href = '#'
    songTitleLink.href = '#'
    singerNameLink2.href = '#'
    singerImageLink.href = '#'
    singerNameLink3.href = '#'
    descriptionLink.href = '#'

    closeIcon.src = '/icons/close.svg'
    songImage.src = '/images/note.jpg'
    addIcon.src = '/icons/plus-circle.svg'

    songTitleNameAdd.append(titleName, addButton)
    rightContainerTop.append(singerNameLink, closeButton)
    closeButton.append(closeIcon)
    songImg.append(songImage)
    songData.append(songImg, songTitleNameAdd)
    titleName.append(songTitleLink, singerNameLink2)
    addButton.append(addIcon)
    singerImg.append(singerImgOver)
    singerImgOver.append(singerImageLink)
    aboutTheArtist.append(singerImg, singerPersonalData)
    listeners.append(listenersText, unfollowButton)
    singerPersonalData.append(singerNameLink3, listeners, descriptionParagraph)
    descriptionParagraph.append(descriptionLink, description)
    mainContainer.append(rightContainerTop, songData, aboutTheArtist)
    place.append(mainContainer)

    document.querySelector('.right-sidebar').addEventListener('scroll', () => {
        const scrollPosition = document.querySelector('.right-sidebar').scrollTop

        if (scrollPosition > 1) {
            rightContainerTop.style.boxShadow = '0px 6px 6px -1px'
        } else {
            rightContainerTop.style.boxShadow = 'none'
        }
    })

    closeButton.onclick = () => {
        rightSidebar.style.display = 'none'
        document.querySelector('.container').style.width = 'calc(100% - 340px)'
        document.querySelector('#song-info').style.borderColor = '#ffffff'
        document.querySelector('#song-info').firstChild.src = '/icons/play-white.svg'
        rightSidebar.classList.remove('active-right-sidebar')
    }
}

export function createHeader(place) {
    let headerContainer = document.createElement('div')
    let innerHeader = document.createElement('div')
    let leftHeader = document.createElement('div')
    let installAppButton = document.createElement('button')
    let downloadIcon = document.createElement('img')
    let installSpan = document.createElement('span')
    let rightHeader = document.createElement('div')
    let profileButton = document.createElement('button')
    let profileImage = document.createElement('img')
    let userNameSpan = document.createElement('span')
    let userMenu = document.createElement('div')
    let linkProfileBtn = document.createElement('a')
    let profileBtn = document.createElement('button')
    let settingsBtn = document.createElement('button')
    let logoutBtn = document.createElement('button')
    let logoutTxt = document.createElement('span')
    let logoutImg = document.createElement('img')
    let previousPage = document.createElement('button')
    let previousPageIcon = document.createElement('img')
    let nextPage = document.createElement('button')
    let nextPageIcon = document.createElement('img')
    let searchPlace = document.createElement('div')
    let searchInput = document.createElement('input')
    let searchIcon = document.createElement('img')

    headerContainer.classList.add('header')
    innerHeader.classList.add('inner-header')
    leftHeader.classList.add('left-header')
    rightHeader.classList.add('right-header')
    profileButton.classList.add('profile-btn')
    installAppButton.classList.add('install-btn')
    userMenu.classList.add('user-menu')
    profileBtn.classList.add('profile-btn')
    settingsBtn.classList.add('settings-btn')
    logoutBtn.classList.add('logout-btn')
    searchPlace.classList.add('search-place')
    searchInput.classList.add('search-input')
    searchIcon.classList.add('search-icon')

    installSpan.innerHTML = 'Install App'
    profileBtn.innerHTML = 'Profile'
    settingsBtn.innerHTML = 'Settings'
    logoutTxt.innerHTML = 'Log-out'
    userNameSpan.innerHTML = 'User Name'

    downloadIcon.src = '/icons/download.svg'
    logoutImg.src = '/icons/log-out.svg'
    previousPageIcon.src = '/icons/previous-page.svg'
    nextPageIcon.src = '/icons/next-page.svg'
    profileImage.src = '/images/user.jpg'
    searchIcon.src = '/icons/srch.svg'

    linkProfileBtn.href = '/pages/profile/'

    searchInput.placeholder = 'Search to calm down 😉'

    installAppButton.append(downloadIcon, installSpan)
    leftHeader.append(previousPage, nextPage, searchPlace)
    previousPage.append(previousPageIcon)
    nextPage.append(nextPageIcon)
    searchPlace.append(searchIcon, searchInput)
    profileButton.append(profileImage, userNameSpan)
    rightHeader.append(installAppButton, profileButton, userMenu)
    userMenu.append(linkProfileBtn, settingsBtn, logoutBtn)
    linkProfileBtn.append(profileBtn)
    logoutBtn.append(logoutTxt, logoutImg)
    innerHeader.append(leftHeader, rightHeader)
    headerContainer.append(innerHeader)
    place.append(headerContainer)

    previousPage.onclick = () => {
        window.history.back()
    }

    nextPage.onclick = () => {
        window.history.forward()
    }

    profileButton.onclick = () => {
        userMenu.classList.toggle('active-user-menu')
    }

    logoutBtn.onclick = () => {
        localStorage.clear()
        location.assign('/pages/login/')
    }

    PUBLIC_URL.getData('/me')
        .then(me => {
            if (me.images.length > 0) {
                profileImage.src = me.images[1].url
            } else {
                profileImage.src = '/images/user.jpg'
            }
            userNameSpan.innerHTML = me.display_name
        })

    searchPlace.style.display = 'none'
}

export function createFooter(place) {
    let footerTop = document.createElement('div')
    let companyColumn = document.createElement('div')
    let companySpan = document.createElement('span')
    let communitiesColumn = document.createElement('div')
    let communitiesSpan = document.createElement('span')
    let usefulLinksColumn = document.createElement('div')
    let usefulLinksSpan = document.createElement('span')
    let spotifyPlansColumn = document.createElement('div')
    let spotifyPlansSpan = document.createElement('span')
    let btns = document.createElement('div')
    let line = document.createElement('div')
    let footerBottom = document.createElement('div')
    let footerText = document.createElement('span')

    footerTop.classList.add('footer-top')
    companyColumn.classList.add('company', 'links-column')
    communitiesColumn.classList.add('communities', 'links-column')
    usefulLinksColumn.classList.add('useful-links', 'links-column')
    spotifyPlansColumn.classList.add('spotify-plans', 'links-column')
    btns.classList.add('btns')
    line.classList.add('line')
    footerBottom.classList.add('footer-bottom')

    companySpan.innerHTML = 'Company';
    communitiesSpan.innerHTML = 'Communities';
    usefulLinksSpan.innerHTML = 'Useful Links';
    spotifyPlansSpan.innerHTML = 'Spotify Plans'
    footerText.innerHTML = '© 2024 Spotify AB'

    const companyLinks = [
        { text: 'About', href: 'https://www.spotify.com/uz/about-us/contact/' },
        { text: 'Jobs', href: 'https://www.lifeatspotify.com/' },
        { text: 'For the Record', href: 'https://newsroom.spotify.com/' }
    ]
    companyColumn.append(companySpan)
    companyLinks.forEach(linkData => {
        let link = document.createElement('a')
        link.href = linkData.href
        link.innerHTML = linkData.text
        companyColumn.append(link)
    })

    const communitiesLinks = [
        { text: 'For Artists', href: 'https://artists.spotify.com/home' },
        { text: 'Developers', href: 'https://developer.spotify.com/' },
        { text: 'Advertising', href: 'https://ads.spotify.com/en-US/' },
        { text: 'Investors', href: 'https://investors.spotify.com/home/default.aspx' },
        { text: 'Vendors', href: 'https://spotifyforvendors.com/' }
    ]
    communitiesColumn.append(communitiesSpan)
    communitiesLinks.forEach(linkData => {
        let link = document.createElement('a')
        link.href = linkData.href
        link.innerHTML = linkData.text
        communitiesColumn.append(link)
    })

    const usefulLinks = [
        { text: 'Support', href: 'https://support.spotify.com/uz/' },
        { text: 'Free Mobile App', href: 'https://www.spotify.com/uz/download/windows/' }
    ]
    usefulLinksColumn.append(usefulLinksSpan)
    usefulLinks.forEach(linkData => {
        let link = document.createElement('a')
        link.href = linkData.href
        link.innerHTML = linkData.text
        usefulLinksColumn.append(link)
    })

    const spotifyPlansLinks = [
        { text: 'Premium Individual', href: 'https://www.spotify.com/uz/premium/?ref=spotifycom_footer_premium_individual' },
        { text: 'Premium Duo', href: 'https://www.spotify.com/uz/duo/?ref=spotifycom_footer_premium_duo' },
        { text: 'Premium Family', href: 'https://www.spotify.com/uz/family/?ref=spotifycom_footer_premium_family' },
        { text: 'Premium Student', href: 'https://www.spotify.com/uz/student/?ref=spotifycom_footer_premium_student' },
        { text: 'Spotify Free', href: 'https://www.spotify.com/uz/free/?ref=spotifycom_footer_free' }
    ]
    spotifyPlansColumn.append(spotifyPlansSpan)
    spotifyPlansLinks.forEach(linkData => {
        let link = document.createElement('a')
        link.href = linkData.href
        link.innerHTML = linkData.text
        spotifyPlansColumn.append(link)
    })

    const socialButtonData = [
        { className: 'instagram', href: 'https://www.instagram.com/spotify', imgSrc: '/icons/instagram.svg' },
        { className: 'twitter', href: 'https://x.com/spotify', imgSrc: '/icons/twitter.svg' },
        { className: 'facebook', href: 'https://www.facebook.com/Spotify', imgSrc: '/icons/facebook.svg' }
    ]
    socialButtonData.forEach(buttonData => {
        let link = document.createElement('a')
        let button = document.createElement('button')
        let img = document.createElement('img')
        button.classList.add(buttonData.className)
        link.href = buttonData.href
        img.src = buttonData.imgSrc
        link.target = '_blank'
        button.append(img)
        link.append(button)
        btns.append(link)
    })

    footerTop.append(companyColumn, communitiesColumn, usefulLinksColumn, spotifyPlansColumn, btns)
    footerBottom.append(footerText)
    place.append(footerTop, line, footerBottom)
}

export function reloadArtists(arr, place) {
    place.innerHTML = ''

    for (let item of arr) {
        let anchor = document.createElement('a')
        let singerContainer = document.createElement('div')
        let dataSide = document.createElement('div')
        let singerImage = document.createElement('div')
        let img = document.createElement('img')
        let singerData = document.createElement('div')
        let name = document.createElement('div')
        let proficiency = document.createElement('div')
        let songPlayingInfo = document.createElement('div')
        let soundIcon = document.createElement('img')

        anchor.classList.add('left-sidebar-singer')
        singerContainer.classList.add('singer')
        dataSide.classList.add('data-side')
        singerImage.classList.add('singer-img')
        singerData.classList.add('singer-data')
        name.classList.add('name')
        proficiency.classList.add('proficiency')
        songPlayingInfo.classList.add('song-playing-info')

        name.innerHTML = item.name
        proficiency.innerHTML = item.type

        img.src = item.images[0].url
        soundIcon.src = '/icons/sound.svg'

        anchor.href = `/pages/artist/index.html?id=${item.id}`

        singerImage.append(img)
        singerData.append(name, proficiency)
        dataSide.append(singerImage, singerData)
        songPlayingInfo.append(soundIcon)
        singerContainer.append(dataSide, songPlayingInfo)
        anchor.append(singerContainer)
        place.append(anchor)

        let curr_page = location.href.split('=').at(-1)

        if (curr_page === item.id) {
            anchor.firstChild.classList.add('active-singer')
        }
    }

    let anchors = document.querySelectorAll('.left-sidebar-singer')

    anchors.forEach(anchor => {
        anchor.onclick = () => {
            anchors.forEach(anch => {
                anch.firstChild.classList.remove('active-singer')
            })

            anchor.firstChild.classList.add('active-singer')
        }
    })
}

export function reloadFollowing(arr, place) {
    place.innerHTML = ''

    for (let item of arr) {
        let link = document.createElement('a')
        let followingSingerDiv = document.createElement('div')
        let imgSideDiv = document.createElement('div')
        let imgElement = document.createElement('img')
        let nameSideDiv = document.createElement('div')
        let nameSpan = document.createElement('span')
        let buttonElement = document.createElement('button')
        let pauseImg = document.createElement('img')

        link.classList.add('link')
        followingSingerDiv.classList.add('following-singer')
        imgSideDiv.classList.add('img-side')
        nameSideDiv.classList.add('name-side')

        link.href = `/pages/artist/index.html?id=${item.id}`
        imgElement.src = item.images[0].url
        pauseImg.src = '/icons/play.svg'

        nameSpan.innerHTML = item.name

        imgSideDiv.append(imgElement)
        buttonElement.append(pauseImg)
        nameSideDiv.append(nameSpan, buttonElement)
        followingSingerDiv.append(imgSideDiv, nameSideDiv)
        link.append(followingSingerDiv)
        place.append(link)
    }
}

export function reloadAlbumContent(arr, place) {
    place.innerHTML = ''

    for (let item of arr) {
        let albumLink = document.createElement('a')
        let contentDiv = document.createElement('div')
        let contentImgDiv = document.createElement('div')
        let img = document.createElement('img')
        let contentDataDiv = document.createElement('div')
        let titleSpan = document.createElement('span')
        let nameSpan = document.createElement('span')

        contentDiv.classList.add('content-album')
        contentImgDiv.classList.add('content-album-img')
        contentDataDiv.classList.add('content-album-data')
        titleSpan.classList.add('album-title')
        nameSpan.classList.add('album-name')

        titleSpan.innerHTML = item.name
        nameSpan.innerHTML = item.type

        img.src = item.images[0].url

        albumLink.href = `/pages/album/index.html?id=${item.id}`

        contentImgDiv.append(img)
        contentDataDiv.append(titleSpan)
        contentDataDiv.append(nameSpan)
        contentDiv.append(contentImgDiv)
        contentDiv.append(contentDataDiv)
        albumLink.append(contentDiv)
        place.append(albumLink)
    }
}

export function reloadArtistContent(arr, place) {
    place.innerHTML = ''

    for (let item of arr) {
        let artistLink = document.createElement('a')
        let contentDiv = document.createElement('div')
        let contentImgDiv = document.createElement('div')
        let img = document.createElement('img')
        let contentDataDiv = document.createElement('div')
        let nameSpan = document.createElement('span')
        let typeSpan = document.createElement('span')

        contentDiv.classList.add('content-artist')
        contentImgDiv.classList.add('content-artist-img')
        contentDataDiv.classList.add('content-artist-data')
        nameSpan.classList.add('artist-name')
        typeSpan.classList.add('artist-type')

        artistLink.href = `/pages/artist/index.html?id=${item.id}`

        nameSpan.innerHTML = item.name
        typeSpan.innerHTML = item.type

        img.src = item.images[0].url

        contentImgDiv.append(img)
        contentDataDiv.append(nameSpan)
        contentDataDiv.append(typeSpan)
        contentDiv.append(contentImgDiv)
        contentDiv.append(contentDataDiv)
        artistLink.append(contentDiv)
        place.append(artistLink)
    }
}

export function reloadSongs(arr, place) {
    place.innerHTML = ''
    let numeration = 1
    let audio = document.querySelector('#audio')
    let playPauseBtn = document.querySelector('#play-pause')
    let playerImage = document.querySelector('.left-side-player .song-img img')
    let playerArtistName = document.querySelector('.left-side-player .name')
    let playerSongTitle = document.querySelector('.left-side-player .title')
    let sidebarArtistNames = document.querySelectorAll('.right-sidebar .sidebar-artist-names')
    let sidebarSongTitle = document.querySelector('.right-sidebar .song-title')
    let sidebarSongImg = document.querySelector('.right-sidebar .song-img img')
    let sidebarSingerImg = document.querySelector('.right-sidebar .singer-img')
    let followersAmount = document.querySelector('.listeners span')
    let totalPlayButton = document.querySelector('.total-play-button-place .play-pause')

    for (let item of arr) {
        let songDiv = document.createElement('div')
        let leftSongDiv = document.createElement('div')
        let numberSpan = document.createElement('span')
        let imgDiv = document.createElement('div')
        let img = document.createElement('img')
        let titleLink = document.createElement('a')
        let popularityDiv = document.createElement('div')
        let popularitySpan = document.createElement('span')
        let durationDiv = document.createElement('div')
        let durationSpan = document.createElement('span')

        let songAnimation = document.createElement('div')
        let animationLine1 = document.createElement('span')
        let animationLine2 = document.createElement('span')
        let animationLine3 = document.createElement('span')
        let animationLine4 = document.createElement('span')
        let animationLine5 = document.createElement('span')

        songAnimation.classList.add('song-animation')
        songDiv.classList.add('song')
        leftSongDiv.classList.add('left-song')
        numberSpan.classList.add('number')
        imgDiv.classList.add('img')
        titleLink.classList.add('title')
        popularityDiv.classList.add('popularity')
        durationDiv.classList.add('duration')

        numberSpan.innerHTML = numeration++
        titleLink.innerHTML = item.name
        popularitySpan.innerHTML = item.popularity + ' / 100'
        durationSpan.innerHTML = millisToMinutesAndSeconds(item.duration_ms)

        img.src = item.album.images[0].url
        titleLink.href = `/pages/song/index.html?id=${item.id}`

        songAnimation.append(animationLine1, animationLine2, animationLine3, animationLine4, animationLine5)
        leftSongDiv.append(numberSpan, songAnimation)
        imgDiv.append(img)
        leftSongDiv.append(imgDiv)
        leftSongDiv.append(titleLink)
        popularityDiv.append(popularitySpan)
        durationDiv.append(durationSpan)
        songDiv.append(leftSongDiv)
        songDiv.append(popularityDiv)
        songDiv.append(durationDiv)
        place.append(songDiv)


        songDiv.onclick = () => {
            audio.src = item.preview_url
            playerImage.src = item.album.images[0].url
            sidebarSongImg.src = item.album.images[0].url
            playerSongTitle.innerHTML = item.name
            sidebarSongTitle.innerHTML = item.name
            playerArtistName.innerHTML = item.artists[0].name
            sidebarArtistNames.forEach(name => {
                name.innerHTML = item.artists[0].name
            })
            audio.play()
            playPauseBtn.innerHTML = '<img src="/icons/pause.svg">'
            totalPlayButton.innerHTML = '<img src="/icons/pause.svg">'

            PUBLIC_URL.getData(`/artists/${item.artists[0].id}`)
                .then(artist => {
                    sidebarSingerImg.style.backgroundImage = `url(${artist.images[0].url})`
                    followersAmount.innerHTML = artist.followers.total.toLocaleString() + '<br>' + 'followers'
                })
        }
    }
}

export function reloadAlbumSongs(arr, place) {
    place.innerHTML = ''
    let numeration = 1
    let audio = document.querySelector('#audio')
    let playPauseBtn = document.querySelector('#play-pause')
    let playerSongTitle = document.querySelector('.left-side-player .title')
    let playerArtistName = document.querySelector('.left-side-player .name')
    let sidebarArtistNames = document.querySelectorAll('.right-sidebar .sidebar-artist-names')
    let sidebarSongTitle = document.querySelector('.right-sidebar .song-title')
    let sidebarSingerImg = document.querySelector('.right-sidebar .singer-img')
    let followersAmount = document.querySelector('.listeners span')
    let totalPlayButton = document.querySelector('.total-play-button-place .play-pause')

    for (let item of arr) {
        let songDiv = document.createElement('div')
        let leftSongDiv = document.createElement('div')
        let numberSpan = document.createElement('span')
        let titleLink = document.createElement('a')
        let popularitySpan = document.createElement('span')
        let durationDiv = document.createElement('div')
        let durationSpan = document.createElement('span')

        songDiv.classList.add('album-song')
        leftSongDiv.classList.add('left-song')
        numberSpan.classList.add('number')
        titleLink.classList.add('title')
        durationDiv.classList.add('duration')

        numberSpan.innerHTML = numeration++
        titleLink.innerHTML = item.name
        popularitySpan.innerHTML = item.popularity + ' / 100'
        durationSpan.innerHTML = millisToMinutesAndSeconds(item.duration_ms)

        titleLink.href = `/pages/song/index.html?id=${item.id}`

        leftSongDiv.append(numberSpan)
        leftSongDiv.append(titleLink)
        durationDiv.append(durationSpan)
        songDiv.append(leftSongDiv)
        songDiv.append(durationDiv)
        place.append(songDiv)

        songDiv.onclick = () => {
            audio.src = item.preview_url
            playerSongTitle.innerHTML = item.name
            sidebarSongTitle.innerHTML = item.name
            playerArtistName.innerHTML = item.artists[0].name
            sidebarArtistNames.forEach(name => {
                name.innerHTML = item.artists[0].name
            })
            audio.play()
            playPauseBtn.innerHTML = '<img src="/icons/pause.svg">'
            totalPlayButton.innerHTML = '<img src="/icons/pause.svg">'

            PUBLIC_URL.getData(`/artists/${item.artists[0].id}`)
                .then(artist => {
                    sidebarSingerImg.style.backgroundImage = `url(${artist.images[0].url})`
                    followersAmount.innerHTML = artist.followers.total.toLocaleString() + '<br>' + 'followers'
                })
        }
    }
}

export function createPlayer(arr, place) {
    let audioElement = document.createElement('audio')
    let leftSidePlayer = document.createElement('div')
    let songImg = document.createElement('div')
    let img = document.createElement('img')
    let nameTitle = document.createElement('div')
    let titleLink = document.createElement('a')
    let nameLink = document.createElement('a')
    let songControll = document.createElement('div')
    let controllBtns = document.createElement('div')
    let progressBar = document.createElement('div')
    let currentTimeSpan = document.createElement('span')
    let progressInput = document.createElement('input')
    let durationTimeSpan = document.createElement('span')
    let soundControll = document.createElement('div')
    let soundDiv = document.createElement('div')
    let volumeImg = document.createElement('img')
    let volumeInput = document.createElement('input')

    leftSidePlayer.classList.add('left-side-player')
    songImg.classList.add('song-img')
    nameTitle.classList.add('name-title')
    titleLink.classList.add('title')
    nameLink.classList.add('name')
    songControll.classList.add('song-controll')
    controllBtns.classList.add('controll-btns')
    progressBar.classList.add('progress-bar')
    currentTimeSpan.classList.add('time')
    durationTimeSpan.classList.add('time')
    soundControll.classList.add('sound-controll')
    soundDiv.classList.add('sound')

    audioElement.id = 'audio'
    audioElement.src = ''

    img.src = '/images/note.jpg'

    titleLink.href = '#'
    titleLink.textContent = 'Song Title'
    nameLink.href = '#'
    nameLink.textContent = 'Singer Name'

    const shuffleBtn = createButton('other-btns', 'shuffle', '/icons/shuffle.svg')
    const previousBtn = createButton('other-btns', 'previous', '/icons/previous.svg')
    const playPauseBtn = createButton('', 'play-pause', '/icons/play.svg')
    const nextBtn = createButton('other-btns', 'next', '/icons/next.svg')
    const repeatBtn = createButton('other-btns', 'repeat', '/icons/repeat.svg')
    const songInfoBtn = createButton('', 'song-info', '/icons/play-green.svg')
    const maximizeMinimizeBtn = createButton('', 'maximize-minimize', '/icons/maximize.svg')

    progressInput.type = 'range'
    progressInput.value = '0'
    progressInput.max = '100'
    progressInput.id = 'progress-stage'
    currentTimeSpan.id = 'current-time'
    durationTimeSpan.id = 'duration-time'
    currentTimeSpan.textContent = '0:00'
    durationTimeSpan.textContent = '0:00'

    volumeImg.src = '/icons/volume.svg'
    volumeInput.type = 'range'
    volumeInput.id = 'volume'
    volumeInput.value = '100'
    volumeInput.min = '0'
    volumeInput.max = '100'

    songImg.append(img)
    nameTitle.append(titleLink)
    nameTitle.append(nameLink)
    leftSidePlayer.append(songImg)
    leftSidePlayer.append(nameTitle)
    controllBtns.append(shuffleBtn)
    controllBtns.append(previousBtn)
    controllBtns.append(playPauseBtn)
    controllBtns.append(nextBtn)
    controllBtns.append(repeatBtn)
    progressBar.append(currentTimeSpan)
    progressBar.append(progressInput)
    progressBar.append(durationTimeSpan)
    songControll.append(controllBtns)
    songControll.append(progressBar)
    soundDiv.append(volumeImg)
    soundDiv.append(volumeInput)
    soundControll.append(songInfoBtn)
    soundControll.append(maximizeMinimizeBtn)
    soundControll.append(soundDiv)
    place.append(audioElement, leftSidePlayer, songControll, soundControll)

    let isRepeat = false
    repeatBtn.onclick = () => {
        isRepeat = !isRepeat
        if (isRepeat) {
            audioElement.loop = true
            repeatBtn.firstChild.src = '/icons/repeat-active.svg'
        } else {
            audioElement.loop = false
            repeatBtn.firstChild.src = '/icons/repeat.svg'
        }
    }

    songInfoBtn.onclick = () => {
        rightSidebar.classList.toggle('active-right-sidebar')

        if (rightSidebar.classList.contains('active-right-sidebar')) {
            rightSidebar.style.display = 'block'
            document.querySelector('.container').style.width = 'calc(100% - 680px)'
            songInfoBtn.style.borderColor = '#65D36E'
            songInfoBtn.firstChild.src = '/icons/play-green.svg'
        } else {
            rightSidebar.style.display = 'none'
            document.querySelector('.container').style.width = 'calc(100% - 340px)'
            songInfoBtn.style.borderColor = '#ffffff'
            songInfoBtn.firstChild.src = '/icons/play-white.svg'
        }
    }

    let totalPlayButton = document.querySelector('.total-play-button-place .play-pause')
    let currentSongIndex = 0
    const songs = []

    shuffleBtn.onclick = () => {
        shuffleBtn.classList.toggle('active-shuffle');
        if (shuffleBtn.classList.contains('active-shuffle')) {
            shuffleBtn.firstElementChild.src = '/icons/shuffle-active.svg'
            shuffleSongs(songs)
        } else {
            shuffleBtn.firstElementChild.src = '/icons/shuffle.svg'
            return songs
        }
    }

    let isPlaying = false

    totalPlayButton.onclick = () => {
        if (!totalPlayButton.classList.contains('activeTotalButton')) {
            totalPlayButton.classList.add('activeTotalButton')
            totalPlayButton.innerHTML = '<img src="/icons/pause.svg">'
            playPauseBtn.innerHTML = '<img src="/icons/pause.svg">'
            isPlaying = true
            audioElement.play()
            loadSong(currentSongIndex)
        } else {
            totalPlayButton.classList.remove('activeTotalButton')
            playPauseBtn.innerHTML = '<img src="/icons/play.svg">'
            totalPlayButton.innerHTML = '<img src="/icons/play.svg">'
            audioElement.pause()
        }
    }

    playPauseBtn.onclick = () => {
        if (isPlaying) {
            audioElement.pause()
            playPauseBtn.innerHTML = '<img src="/icons/play.svg">'
            totalPlayButton.innerHTML = '<img src="/icons/play.svg">'
        } else {
            audioElement.play()
            playPauseBtn.innerHTML = '<img src="/icons/pause.svg">'
            totalPlayButton.innerHTML = '<img src="/icons/pause.svg">'
        }
        isPlaying = !isPlaying
    }

    audioElement.addEventListener('timeupdate', function () {
        let currentTime = audioElement.currentTime
        let duration = audioElement.duration
        let progress = (currentTime / duration) * 100
        progressInput.style.backgroundSize = `${progress}% 100%`

        progressInput.value = progress
        currentTimeSpan.textContent = formatTime(currentTime)
        durationTimeSpan.textContent = formatTime(duration)
    })

    progressInput.addEventListener('input', function () {
        let seekTime = audioElement.duration * (progressInput.value / 100)
        audioElement.currentTime = seekTime
    })

    volumeInput.addEventListener('input', () => {
        audioElement.volume = volumeInput.value / 100
        volumeInput.style.backgroundSize = `${audioElement.volume * 100}% 100%`
    })

    volumeInput.style.backgroundSize = `${audioElement.volume * 100}% 100%`

    let songImgPlace = document.querySelector('.song-data .song-img img')
    let songArtistImgPlace = document.querySelector('.right-sidebar .singer-img')
    let songTitlePlace = document.querySelector('.title-name .song-title')
    let playerImage = document.querySelector('.left-side-player .song-img img')
    let playerArtistName = document.querySelector('.left-side-player .name')
    let playerSongTitle = document.querySelector('.left-side-player .title')
    let sidebarArtistNames = document.querySelectorAll('.right-sidebar .sidebar-artist-names')
    let followersAmount = document.querySelector('.listeners span')

    for (let item of arr) {
        songs.push(item)
    }

    previousBtn.onclick = () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length
        playPauseBtn.innerHTML = '<img src="/icons/pause.svg">'
        totalPlayButton.innerHTML = '<img src="/icons/pause.svg">'
        isPlaying = true
        loadSong(currentSongIndex)
    }

    nextBtn.onclick = () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length
        playPauseBtn.innerHTML = '<img src="/icons/pause.svg">'
        totalPlayButton.innerHTML = '<img src="/icons/pause.svg">'
        isPlaying = true
        loadSong(currentSongIndex)
    }

    audioElement.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length
        playPauseBtn.innerHTML = '<img src="/icons/pause.svg">'
        totalPlayButton.innerHTML = '<img src="/icons/pause.svg">'
        isPlaying = true
        loadSong(currentSongIndex)
    })

    function loadSong(index) {
        audioElement.src = songs[index].preview_url
        audioElement.play()
        PUBLIC_URL.getData(`/artists/${songs[index].artists[0].id}`)
            .then(artist => {
                songArtistImgPlace.style.backgroundImage = `url(${artist.images[0].url})`
                followersAmount.innerHTML = `${artist.followers.total.toLocaleString()}<br>followers`
            })
        playerArtistName.innerHTML = songs[index].artists[0].name
        playerSongTitle.innerHTML = songs[index].name
        songTitlePlace.innerHTML = songs[index].name
        sidebarArtistNames.forEach(artistName => {
            artistName.innerHTML = songs[index].artists[0].name
        })
        songImgPlace.src = songs[index].album.images[0].url
        playerImage.src = songs[index].album.images[0].url
    }
}