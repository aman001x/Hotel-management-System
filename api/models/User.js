import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    country:{
        type: String,
        require: true,
    },
    img:{
        type:String
    },
    city:{
        type:String,
        require:true,
    },
    phone:{
        type:String,
        require:true,
    },
    password: {
        type: String,
        required: true, // This should be true, but no unique constraint
        // unique: true, // Remove this line
    },
    isAdmin: {
        type: Boolean,
        default: false, // Set a default value for isAdmin
    },
}, 
{ timestamps: true });

export default mongoose.model("User", UserSchema);
