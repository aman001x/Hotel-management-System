import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

// Registration function
export const register = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) return next(createError(400, "Username already exists"));

        // Hashing the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        // Creating a new user
        const newUser = new User({
            ...req.body,
            password: hash,
            
        });

        await newUser.save();
        res.status(200).send("User has been created.");
    } catch (err) {
        next(err);
    }
};

// Login function
export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(404, "User not found"));

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError(400, "Wrong Password or Username"));

        // Sign the token with the secret from the environment variable
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // Optional: you can set an expiration time for the token
        );

        // Exclude password and admin status from response
        const { password, isAdmin, ...otherDetails } = user._doc;

        // Set the token in the cookies and send the response
        res.cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json({ details: { ...otherDetails }, isAdmin });
    } catch (err) {
        next(err);
    }
};
