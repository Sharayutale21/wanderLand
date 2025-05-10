//if(process.env.NODE_ENV != "production"){
//	require('dotenv').config()
//}
//console.log(process.env.SECRET)
require('dotenv').config();


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const session = require("express-session");

const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

const { router: listingRouter, validateListing } = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")

//connect to db
const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderland'
main().then(()=>{
	console.log("connected to db")
}).catch((err)=>{
	console.log(err)
})

async function main(){
	await mongoose.connect(MONGO_URL)
}


const sessionOptions ={
	
	secret : process.env.SECRET,
	resave : false,
	saveUninitialized : true,
	cookie :{
		expires:Date.now()+7*24*60*60*1000,
		maxAge :  7*24*60*60*1000,
		httpOnly : true,
	}
}



app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







//to connect to views folder
app.engine('ejs', ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.json());

//app.get("/",(req,res)=>{
//	res.send("hi , I am root")
//})

app.use((req,res,next)=>{
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currUser = req.user;
	next() 
})

//app.get("/demouser",async(req,res)=>{
//	let fakeUser = new User({
//		email : "student@gmail.com",
//		username : "delta-student"
//	})
//	let registeredUser = await User.register(fakeUser,"helloworld");
//	res.send(registeredUser)
//})

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
	res.status(statusCode).render("error.ejs",{message})
  
	
});
app.listen(8080,()=>{
	console.log("Server is running on port 8080")
})
