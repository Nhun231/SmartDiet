const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import User model
const User = require('../src/models/user.model');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Update existing users with premium fields
const updateUsersWithPremiumFields = async () => {
    try {
        console.log('Starting user update process...');
        
        // Find users that don't have the new premium fields
        const usersToUpdate = await User.find({
            $or: [
                { level: { $exists: false } },
                { coins: { $exists: false } },
                { aiChatUsed: { $exists: false } },
                { expertChatUsed: { $exists: false } },
                { lastResetDate: { $exists: false } }
            ]
        });

        console.log(`Found ${usersToUpdate.length} users to update`);

        if (usersToUpdate.length === 0) {
            console.log('All users already have premium fields. No updates needed.');
            return;
        }

        // Update each user with default premium values
        const updatePromises = usersToUpdate.map(async (user) => {
            const updateData = {};
            
            if (!user.level) updateData.level = 1;
            if (!user.coins) updateData.coins = 0;
            if (!user.aiChatUsed) updateData.aiChatUsed = 0;
            if (!user.expertChatUsed) updateData.expertChatUsed = 0;
            if (!user.lastResetDate) updateData.lastResetDate = new Date();
            
            return User.findByIdAndUpdate(user._id, updateData, { new: true });
        });

        const updatedUsers = await Promise.all(updatePromises);
        
        console.log(`Successfully updated ${updatedUsers.length} users with premium fields`);
        
        // Log some examples
        console.log('Sample updated users:');
        updatedUsers.slice(0, 3).forEach(user => {
            console.log(`- ${user.username}: Level ${user.level}, Coins: ${user.coins}`);
        });
        
    } catch (error) {
        console.error('Error updating users:', error);
        throw error;
    }
};

// Main function
const main = async () => {
    try {
        await connectDB();
        await updateUsersWithPremiumFields();
        console.log('User update process completed successfully!');
    } catch (error) {
        console.error('Process failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    }
};

// Run the script
main();
