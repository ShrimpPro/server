const axios = require('axios')
const XENDIT_API_KEY = 'eG5kX2RldmVsb3BtZW50XzdOS0xYdGR4RlhNQm5TMjNBcWRaWkRkZDBvcXhpWFh2MnZNcGE3NW1qVUt4MUdKUXFBR29Oa3U3SVJRdWUyOg=='
const XENDIT_API_URL = 'https://api.xendit.co/'

module.exports = class Xendit {
static getXenditInvoice = async (body) => {
        try {
            const headers = {
                Authorization: `Basic ${XENDIT_API_KEY} `
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