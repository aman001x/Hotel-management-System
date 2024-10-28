import express from 'express';
import { allrooms, createRoom, deleteRoom, getRoom, updateRoom, updateRoomAvailability } from '../controllers/room.js';
import { verifyAdmin } from './util/verifyToken.js';

const router = express.Router();

// Define routes for rooms
router.get('/', allrooms); // List all rooms
router.put('/availability/:roomId', updateRoomAvailability);
router.post('/:hotelid', createRoom); // Create a new room
router.put('/:id', updateRoom); // Update a room by ID
router.delete('/:id/:hotelid',  deleteRoom); // Delete a room by ID
router.get('/:id', getRoom); // Get a room by ID


export default router;
