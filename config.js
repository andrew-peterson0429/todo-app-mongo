const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    endpoint: process.env.API_URL,
    masterKey: process.env.API_KEY,
    port: process.env.PORT,
    mongoUser: process.env.MONGO_USER,
    mongoPass: process.env.MONGO_PASS
}