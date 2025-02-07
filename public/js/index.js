/* eslint-disable */
import '@babel/polyfill'
import { login, logout } from './login'
import displayMap from './mapbox'
import { updateSettings } from './updateSettings'
// DOM ELEMENTS
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form.form--login')
const logoutBtn = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form.form-user-data')
const userPasswordForm = document.querySelector('.form.form-user-settings')

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

if (userDataForm) {
    userDataForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const form = new FormData()
        form.append('name', document.getElementById('name').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo', document.getElementById('photo').files[0])
        console.log('form', form)
        updateSettings(form, 'data')
    })
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const passwordCurrent =
            document.getElementById('password-current').value
        const password = document.getElementById('password').value
        const passwordConfirm =
            document.getElementById('password-confirm').value
        updateSettings(
            { passwordCurrent, password, passwordConfirm },
            'password'
        )
    })
}
