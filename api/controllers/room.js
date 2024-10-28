// api/controllers/room.js
import Rooms from "../models/Rooms.js";
import Hotel from "../models/Hotel.js"; // Make sure this path is correct
import { createError } from "../routes/util/error.js"; // Adjust the import path if needed


// Create Room
export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Rooms(req.body);
  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, { $push: { rooms: savedRoom._id } });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

// Update Reserve Room
export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Rooms.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};



import mongoose from "mongoose";

export const updateRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { dates } = req.body;

    console.log(`Updating room with ID: ${roomId}`);
    console.log(`Dates to be added: ${dates}`);

    // Validate roomId format
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID format' });
    }

    
    // Use 'new' to create an ObjectId instance
    const result = await Rooms.updateOne(
      { 'roomNumbers._id': new mongoose.Types.ObjectId(roomId) }, // Correct instantiation here
      { $push: { 'roomNumbers.$.unavailableDates': { $each: dates } } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Room not found or no updates were made' });
    }

    res.status(200).json({ message: 'Room updated successfully' });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};



// Delete Room
export const deleteRoom = async (req, res, next) => {
  try {
    const deletedRoom = await Rooms.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.status(200).json({ message: "Room has been deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Room
export const getRoom = async (req, res, next) => {
  try {
    const room = await Rooms.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Rooms
export const allrooms = async (req, res, next) => {
  try {
    const allRooms = await Rooms.find();
    res.status(200).json(allRooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


