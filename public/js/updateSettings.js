/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

export const updateSettings = async (data, type) => {
    try {
        const url =
            type === 'password'
                ? '/api/v1/users/updateMyPassword'
                : '/api/v1/users/updateMe'
        const response = await axios({
            method: 'PATCH',
            url: url,
            data: data,
        })

        if (response.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully`)
        }
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}
