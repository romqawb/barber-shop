import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const shopSchema = new Schema({
    name: String,
    address: String,
    prices: {
        cut: Number,
        beard: Number,
        shave: Number,
        shape: Number
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    }
})

export default mongoose.model('Shop', shopSchema);