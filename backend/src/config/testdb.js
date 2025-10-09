
const mongoose = require('mongoose');

module.exports = async function testDbConnection() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error('Error: MONGO_URI environment variable not set');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Mongoose connected successfully');
    } catch (err) {
        console.error('Mongoose connection error:', err);
        process.exit(1);
    }
}


