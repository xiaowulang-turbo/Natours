/* eslint-disable */
import '@babel/polyfill'
import { login, logout } from './login'
import displayMap from './mapbox'

// DOM ELEMENTS
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form.form--login')
const logoutBtn = document.querySelector('.nav__el--logout')

// DElEGATION
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations)
    displayMap(locations)
}

if (loginForm) {
    console.log('loginForm', loginForm)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault()
        // VALUES
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        login(email, password)
    })
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout)
}
