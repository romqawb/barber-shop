//APP INIT
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Shop from './models/shop.js';
import geo from 'mapbox-geocoding';
import ejsMate from 'ejs-mate';
dotenv.config()
geo.setAccessToken(process.env.MAPBOX_TOKEN)


const __dirname = path.resolve();
const app = express();

//DB
const db = mongoose.connection;
try {
    await mongoose.connect('mongodb://localhost:27017/barber-shop')
} catch (e) {
    console.log(e)
}
// db.on('error', console.error.bind(console, 'connection error'))
// db.once('open', () => console.log('DB connected successfully!'))


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);

app.get('/', async (req, res) => {
    let shops = await Shop.find({})
    res.render('home', { shops });
})

app.get('/shop/new', (req, res) => {
    res.render('createshop');
})

app.post('/shop', async (req, res) => {
    const newShop = new Shop(req.body.shop);
    geo.geocode('mapbox.places', req.body.shop.address, async (err, geoData) => {
        newShop.geometry = geoData.features[0].geometry;
        await newShop.save()
        res.redirect('/');
    });
})

app.listen(3000, () => {
    console.log('up');
})
