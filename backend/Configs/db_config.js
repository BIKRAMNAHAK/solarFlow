const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS resolution with MongoDB Atlas SRV connection strings
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.log('DNS setServers error:', e.message);
}

const DB_URI = process.env.MONGO_URI || 'mongodb+srv://bikramnahak9714:c2qKnlmErYZ0BR2q@cluster0.9n2j2.mongodb.net/SolarFlow';

mongoose.connect(DB_URI)
  .then(() => console.log('Data base is Connected Successfully....'))
  .catch((err) => {
    console.log('Database conectivity is faild..!', err);
  });

module.exports = mongoose;