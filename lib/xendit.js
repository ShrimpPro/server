const axios = require('axios')
const XENDIT_API_KEY = process.env.API_XENDIT
const XENDIT_API_URL = 'https://api.xendit.co/'
const XENDIT_CALLBACK= process.env.CALLBACK_XENDIT


module.exports = class Xendit {
static getXenditInvoice = async (body) => {
        try {
            const headers = {
                Authorization: `Basic ${XENDIT_API_KEY} `,
                Authorization2: `Basic ${XENDIT_CALLBACK}`
            }
            const response = await axios({
                method:'POST',
                url: XENDIT_API_URL+'v2/invoices',
                data: body,
                headers
            })
            return response.data 
        } catch (error) {
            console.log(error.response.data)
        }
    } 
}