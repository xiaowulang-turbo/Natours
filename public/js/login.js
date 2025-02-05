/* eslint-disable */
const login = async (email, password) => {
    try {
        const response = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password,
            },
        })
        console.log(response)
    } catch (err) {
        console.log(err)
    }
}

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault()
    // alert('Submitting')
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
})
