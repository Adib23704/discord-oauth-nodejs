const qs = require('qs');
const fastify = require('fastify')({ logger: false, querystringParser: str => qs.parse(str) });
require('dotenv').config();

fastify.register(require('./routes/info'));

const start = async () => {
    fastify.listen({ port: 3000 })
        .then((address) => console.log(`server listening on ${address}`))
        .catch(err => {
            console.log('Error starting server:', err)
            process.exit(1)
        })
};

start();