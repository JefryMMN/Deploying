require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techfest')
  .then(async () => {
    console.log("Connected to DB, adding events...");
    
    // Clear existing if any
    await Event.deleteMany({});
    
    await Event.insertMany([
      {
        name: "Hackathon 2026",
        category: "Coding",
        description: "24-hour coding challenge",
        fee: 500,
        seats: 100,
        date: new Date("2026-12-01")
      },
      {
        name: "Robo Wars",
        category: "Robotics",
        description: "Robot combat arena",
        fee: 250,
        seats: 50,
        date: new Date("2026-12-02")
      },
      {
        name: "AI Workshop",
        category: "Workshop",
        description: "Learn building AI agents",
        fee: 100,
        seats: 200,
        date: new Date("2026-12-03")
      }
    ]);
    
    console.log("Events added successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
