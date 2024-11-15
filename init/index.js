const mongoose=require('mongoose');
const initData=require('./data.js');
const listing=require('../models/listing.js');

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Connected to database");
}).catch((err)=>{
    console.log("Error connecting to database");
    console.log(err);
});

const initDB= async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log("Database intialized");
};

initDB();