const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');


const MONGO_URL = "mongodb://127.0.0.1:27017/wonderland"
main().then(()=>{
	console.log("connected to db")
}).catch((err)=>{
	console.log(err)
})

async function main(){
	await mongoose.connect(MONGO_URL)
}

const ownerId = new mongoose.Types.ObjectId("6819e95373aa36bf525b5dbd");

const initDB = async ()=>{
	await Listing.deleteMany({});//phle sara data delete krenge
	initData.data = initData.data.map((obj) => ({
		...obj,
		owner: ownerId, // Correct type: ObjectId
	  }));
	
	await Listing.insertMany(initData.data);
	console.log("data was initialised");

}
initDB();