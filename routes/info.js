require('dotenv').config();
const axios = require('axios');

const httpClient = axios.create({
    baseURL: 'https://discord.com/api',
    timeout: 30 * 1e3,
});

let token;

function routes(fastify, options, done) {
    fastify.get('/', (req, reply) => {
        reply.redirect(process.env.AUTH_LINK)
    });

    fastify.get('/info', async (req, reply) => {
        const { code } = req.query;
        const options = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
        const { data: data } = await httpClient.post('/oauth2/token', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:3000/info'
        }, options);
        token = `${data.token_type} ${data.access_token}`;
        reply.redirect('/me');
    });

    fastify.get('/me', async (req, reply) => {
        const options = {
            headers: { 'Authorization': token }
        };
        const { data: data } = await httpClient.get('/users/@me', options);
        const { data: guilds } = await httpClient.get('/users/@me/guilds', options);
        const info = { ...data, guilds };
        reply.send(info);
    })

    done();
}

module.exports = routes