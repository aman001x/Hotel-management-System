import mongoose from 'mongoose';
const { Schema } = mongoose;

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  maxPeople: {
    type: Number,
    required: true
  },
  roomNumbers: [{
    number: { type: Number },
    unavailableDates: [{ type: Date }]  // Corrected spelling here
  }],
  price: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Rooms', RoomSchema);
