

const { MongoClient } = require('mongodb');

module.exports = async function testDbConnection() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error('Error: MONGO_URI environment variable not set');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log(' Successfully connected to MongoDB!');

        // Optionally list databases to verify access
        const databasesList = await client.db().admin().listDatabases();
        console.log('Databases:');
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    } catch (error) {
        console.error(' Failed to connect to MongoDB:', error);
    } finally {
        await client.close();
    }
}


