// import express from "express"
// import dotenv from "dotenv"
// import mongoose from "mongoose"
// const app =express();
// import authRoute from "./api/routes/auth.js"
// import usersRoute from "./api/routes/user.js"
// import hotelsRoute from "./api/routes/hotels.js"
// import roomsRoute from "./api/routes/rooms.js"
// dotenv.config();
// const connect = async()=>{
//     try {
//         await mongoose.connect('mongodb://127.0.0.1:27017/test');
//         console.log("connected to MongoDB")
//       } catch (error) {
//         throw error
//       }

// };
// mongoose.connection.on("disconnected",()=>{
//     console.log("MongodB disconnect")
// })
// // app.get("/",(req,res)=>{
// //     res.send("hello first request")
// // })



//       //middleware
//       app.use(express.json())
//       app.use("/api/auth", authRoute);
//       app.use("/api/users", usersRoute);
//       app.use("/api/hotels", hotelsRoute);
//       app.use("/api/rooms", roomsRoute);
      
// app.listen(8080,()=>{
//     connect()
//     console.log("connected to Backend.")
// })






import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./api/routes/auth.js";
import usersRoute from "./api/routes/user.js";
import hotelsRoute from "./api/routes/hotels.js";
import roomsRoute from "./api/routes/rooms.js";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from "cors"
import path from "path";



dotenv.config();

const app = express();








// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test');
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Event listener for MongoDB connection
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});






// Middleware
app.use(express.json());
app.use(bodyParser.json()); 
app.use(cookieParser())
app.use(cors())



// Route middleware
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use(express.static('public'));



// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


// Start server
app.listen(8080, () => {
  connect();
  console.log("Backend connected and running on port 8080.");
});
