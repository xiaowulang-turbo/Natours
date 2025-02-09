/* eslint-disable */
const nodemailer = require('nodemailer')
const { htmlToText } = require('html-to-text')
const pug = require('pug')

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email
        this.firstName = user.name
        this.url = url
        this.from = `${process.env.EMAIL_FROM}`
        console.log(this.to, this.firstName, this.url, this.from)
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Mailersend
            console.log('Sending email with Mailersend')
            return nodemailer.createTransport({
                // host: process.env.MAILERSEND_HOST,
                host: '54.243.76.113',
                port: process.env.MAILERSEND_PORT,
                auth: {
                    user: process.env.MAILERSEND_USERNAME,
                    pass: process.env.MAILERSEND_PASSWORD,
                },
            })
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        })
    }

    async send(template, subject) {
        // 1) Render HTML based on a pug template
        console.log(`${__dirname}/../views/email/${template}.pug`)
        const html = pug.renderFile(
            `${__dirname}/../views/email/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject,
            }
        )

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html),
        }

        // 3) Actually send the email
        await this.newTransport().sendMail(mailOptions)
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours family!')
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)'
        )
    }
}
