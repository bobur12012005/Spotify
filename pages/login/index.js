const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI
const AUTH_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT
const RESPONSE_TYPE = import.meta.env.VITE_RESPONSE_TYPE

const a = document.querySelector('a')
a.onclick = () => localStorage.setItem('user', 'user')
a.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=playlist-modify-public`