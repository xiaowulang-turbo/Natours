/* eslint-disable */

import login from './login'

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault()
    // alert('Submitting')
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
})
