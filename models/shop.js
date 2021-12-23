import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const options = { toJSON: { virtuals: true } }
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
}, options)
shopSchema.virtual('properties.id').get(function () {
    return this._id
})

shopSchema.virtual('properties.name').get(function () {
    return this.name
})
shopSchema.virtual('properties.prices').get(function () {
    return this.prices
})


export default mongoose.model('Shop', shopSchema);