/* eslint-disable */

import axios from 'axios'

export default async function login(email, password) {
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
            alert('Login successful')
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
    } catch (err) {
        console.log(err)
    }
}
