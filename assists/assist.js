export function getAverageRGB(imgEl) {
    var blockSize = 5,
        defaultRGB = { r: 0, g: 0, b: 0 },
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = { r: 0, g: 0, b: 0 },
        count = 0

    if (!context) {
        return defaultRGB
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width

    context.drawImage(imgEl, 0, 0)

    try {
        data = context.getImageData(0, 0, width, height)
    } catch (e) {
        alert('x')
        return defaultRGB
    }

    length = data.data.length

    while ((i += blockSize * 4) < length) {
        ++count
        rgb.r += data.data[i]
        rgb.g += data.data[i + 1]
        rgb.b += data.data[i + 2]
    }

    rgb.r = ~~(rgb.r / count)
    rgb.g = ~~(rgb.g / count)
    rgb.b = ~~(rgb.b / count)

    return rgb
}

export function formatTime(time) {
    let minutes = Math.floor(time / 60)
    let seconds = Math.floor(time % 60)
    seconds = seconds < 10 ? '0' + seconds : seconds
    return `${minutes}:${seconds}`
}

export function createButton(className, id, src) {
    const button = document.createElement('button')
    if (className) {
        button.classList.add(className)
    }
    button.id = id
    const img = document.createElement('img')
    img.src = src
    button.appendChild(img)
    return button
}

export function millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000)
    let seconds = ((millis % 60000) / 1000).toFixed(0)
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds
}

export function shuffleSongs(array) {
    let currentIndex = array.length
    let temporaryValue, randomIndex

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}