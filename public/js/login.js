/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

export async function login(email, password) {
    try {
        const response = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password,
            },
        })

        if (response.data.status === 'success') {
            showAlert('success', 'Login successful')
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}

export const logout = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        })

        if (response.data.status === 'success') {
            showAlert('success', 'Logout successful')
            location.reload(true) // true means that the page will be reloaded and the cache will be cleared
            location.assign('/')
        }
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}
