import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
    packageName: {
        type: String,
        required: true,
        trim: true
    },
    hotelName: {
        type: String,
        required: true,
        trim: true
    },
    packageDestination: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    selectedCities: {
        type: [String],
        required: true
    },
    hotelTypes: {
        type: [String], 
        required: true
    },
    checkInTimes: {
        type: String, 
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availableRooms: {
        type: Number,
        required: true
    },
    pricePerAdult: {
        type: Number,
        required: true
    },
    pricePerChild: {
        type: Number,
        required: true
    },
    adults: {
        type: Number,
        required: true
    },
    mealOptions: {
        type: [String], 
        required: true
    },
    foodCategory: {
        type: [String], 
        required: true
    },
    facilities: {
        type: [String],
        required: true
    },
    rating: {
        type: Number, 
        required: true,
        min: 0,
        max: 5
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    bookingDate: {
        type: Date
    },
    mainImage: { type: String },
    additionalImages: { type: [String] },
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

export default Package;
