// import express from 'express';
// const router = express.Router();

// // Define routes for users
// router.get('/', (req, res) => {
//   res.status(200).json({ message: "Users route" });
// });

// export default router;
import express from "express";
import User from "../models/User.js";
import { verifyToken, verifyUser } from "./util/verifyToken.js";

const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
    const { username, password, email, isAdmin, featured } = req.body;

    // Check if the required fields 'username', 'password', and 'email' are provided
    if (!username || !password || !email) {
        return res.status(400).json({ error: "Fields 'username', 'password', and 'email' are required" });
    }

    try {
        // Create and save the new user
        const newUser = new User({
            username,
            password, // Ensure password is hashed before saving (this should be done before creating the User)
            email,
            isAdmin: isAdmin || false, // Default to false if not provided
            featured: featured || false // Default to false if not provided
        });
        
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // 201 Created
    } catch (err) {
        res.status(500).json({ error: err.message }); // Better error handling
    }
});


// router.get("/check",verifyToken,(req,res,next)=>{
//     res.send("hello, you are looged in")
// })
// Route for authentication check
router.get("/check", verifyToken, (req, res) => {
    res.status(200).json({ message: "Hello user, you are logged in" });
});

// Route to get user by ID
router.get("/checkUser/:id", verifyUser, async (req, res) => {
    try {
        // Find user by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Send a success message indicating the user is logged in
        res.status(200).json({ message: `Hello user, you are logged in` });

    } catch (err) {
        // Handle server errors
        res.status(500).json({ error: err.message });
    }
});

// Update an existing user
router.put("/:id", async (req, res) => {
    try {
        // Update user by ID
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message }); // Better error handling
    }
});

// Delete a user
router.delete("/:id", async (req, res) => {
    try {
        // Delete user by ID
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User has been deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message }); // Better error handling
    }
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
    try {
        // Get user by ID
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message }); // Better error handling
    }
});

// Get all users
router.get("/", async (req, res) => {
    try {
        // Get all users
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message }); // Better error handling
    }
});








export default router;

