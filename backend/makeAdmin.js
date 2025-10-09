const mongoose = require('mongoose');
const User = require('./src/models/user.model');
require('dotenv').config();

async function makeAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = process.argv[2];
        if (!email) {
            console.log('Usage: node makeAdmin.js <email>');
            process.exit(1);
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();
        console.log(`✅ ${email} is now an admin`);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

makeAdmin();
