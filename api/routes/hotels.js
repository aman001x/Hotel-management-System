import express from "express";
import Hotel from "../models/Hotel.js";
import { verifyAdmin } from "./util/verifyToken.js";
import Room from "../models/Rooms.js";
import mongoose from 'mongoose';

const router = express.Router();

// Create a new hotel
router.post("/", async (req, res) => {
    const { name, type, city, address, distance, photos, description, title, rating, rooms, cheapestPrice, featured } = req.body;

    // Check if the required field 'featured' is provided
    if (featured === undefined) {
        return res.status(400).json({ error: "Field 'featured' is required" });
    }

    try {
        // Create and save the new hotel
        const newHotel = new Hotel({
            name,
            type,
            city,
            address,
            distance,
            photos,
            description,
            title,
            rating,
            rooms,
            cheapestPrice,
            featured
        });

        const savedHotel = await newHotel.save();
        res.status(201).json(savedHotel); // 201 Created
    } catch (err) {
        res.status(500).json({ error: err.message }); // Better error handling
    }
});

// Update an existing hotel
router.put("/:id", async (req, res) => {
    try {
        // Update hotel by ID
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        if (!updatedHotel) {
            return res.status(404).json({ error: "Hotel not found" });
        }

        res.status(200).json(updatedHotel);
    } catch (err) {
        res.status(500).json({ error: err.message }); // Better error handling
    }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!deletedHotel) {
            return res.status(404).json({ error: "Hotel not found" });
        }
        res.status(200).json({ message: "Hotel has been deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single hotel by ID
router.get("/find/:id", async (req, res) => {
    try {
        // Get hotel by ID
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ error: "Hotel not found" });
        }

        res.status(200).json(hotel);
    } catch (err) {
        res.status(500).json({ error: err.message }); // Better error handling
    }
});

// // Get all hotels
// router.get("/", async (req, res) => {
//     try {
//         // Get all hotels
//         const hotels = await Hotel.find();
//         res.status(200).json(hotels);
//     } catch (err) {
//         res.status(500).json({ error: err.message }); // Better error handling
//     }
// });



router.get("/", async (req, res) => {
    const { min = 1, max = 999, limit = 30, ...others } = req.query;

    // Convert query parameters
    const minPrice = Number(min);
    const maxPrice = Number(max);
    const query = { ...others };

    // Convert 'featured' to boolean if it's present and is a string
    if (query.featured) {
        query.featured = query.featured === 'true'; // Convert 'true' string to boolean
    }

    // Ensure limit is a number
    const resultLimit = Number(limit) || 10;

    try {
        // Log the constructed query and parameters for debugging
        console.log("Query parameters:", { min: minPrice, max: maxPrice, query });

        // Find hotels based on the query parameters
        const hotels = await Hotel.find({
            ...query,
            cheapestPrice: { $gt: minPrice, $lt: maxPrice }
        }).limit(resultLimit);

        // Log the retrieved hotels for debugging
        console.log("Retrieved hotels:", hotels);

        // Handle empty results
        if (hotels.length === 0) {
            console.log("No hotels found with the given parameters.");
            return res.status(404).json({ message: "No hotels found with the given parameters." });
        }

        // Return the hotels as JSON response
        res.status(200).json(hotels);
    } catch (err) {
        // Log the error for debugging
        console.error("Error fetching hotels:", err.message);
        res.status(500).json({ error: err.message });
    }
});




router.get("/countByCity", async (req, res, next) => {
    // Check if `req.query.cities` is present and is a string
    if (!req.query.cities || typeof req.query.cities !== 'string') {
        return res.status(400).json({ error: "Cities query parameter is required and must be a string" });
    }
    
    const cities = req.query.cities.split(",");
    
    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({ city: city.trim() }); // Trim city name to remove extra spaces
        }));
        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
});
router.get("/countByType", async (req, res, next) => {
   
    
    try {
        const hotelCount = await Hotel.countDocuments({type :"hotel"})
        const apartmentCount =await  Hotel.countDocuments({type :"apartment"})
        const resortCount = await Hotel.countDocuments({type :"resort"})
        const villaCount =await  Hotel.countDocuments({type :"villa"})
        const cabinCount = await Hotel.countDocuments({type :"cabin"})


        
        res.status(200).json([
            {type : "hotel", count :hotelCount},
            {type : "apartments", count :apartmentCount},
            {type : "resorts", count :cabinCount},
            {type : "villas", count :villaCount},
            {type : "cabins", count :cabinCount},
        ]);
    } catch (err) {
        next(err);
    }
});

router.get("/room/:id", async (req, res, next) => {
    try {
        const hotelId = req.params.id;

        // Validate hotelId if necessary
        if (!mongoose.Types.ObjectId.isValid(hotelId)) {
            return res.status(400).json({ error: "Invalid hotel ID format" });
        }

        // Find the hotel by ID
        const hotel = await Hotel.findById(hotelId);
        
        // Check if the hotel exists
        if (!hotel) {
            return res.status(404).json({ error: "Hotel not found" });
        }

        // Validate and fetch rooms
        const roomsList = await Promise.all(
            hotel.rooms.map(async (roomId) => {
                if (mongoose.Types.ObjectId.isValid(roomId)) {
                    return Room.findById(roomId);
                } else {
                    return null; // or you can handle this case differently
                }
            })
        );

        // Filter out any null values (rooms that were not found)
        const filteredRooms = roomsList.filter(room => room !== null);

        // Respond with the list of rooms
        res.status(200).json(filteredRooms);
    } catch (err) {
        // Pass any errors to the error-handling middleware
        console.error(err);  // Log error for debugging
        next(err);
    }
});


export default router;

