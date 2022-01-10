//APP INIT
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Shop from './models/shop.js';
import geo from 'mapbox-geocoding';
import ejsMate from 'ejs-mate';
import methodOverride from 'method-override';
import favicon from 'serve-favicon';
import AppError from './helpers/AppError.js';

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
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(favicon(path.join(__dirname, 'public/images/favicon.png')))

app.get('/', async (req, res) => {
    const shops = await Shop.find({})
    const minPrices = {
        cut: shops[0] ? shops[0].prices.cut : 0,
        beard: shops[0] ? shops[0].prices.beard : 0,
        shave: shops[0] ? shops[0].prices.shave : 0,
        shape: shops[0] ? shops[0].prices.shape : 0
    }
    shops.map(shop => {
        shop.prices.cut < minPrices.cut ? minPrices.cut = shop.prices.cut : null;
        shop.prices.beard < minPrices.beard ? minPrices.beard = shop.prices.beard : null;
        shop.prices.shave < minPrices.shave ? minPrices.shave = shop.prices.shave : null;
        shop.prices.shape < minPrices.shape ? minPrices.shape = shop.prices.shape : null;
    })
    res.render('index', { shops, minPrices });
})

app.get('/shop/new', (req, res) => {
    res.render('shop/create');
})

app.get('/shop/:id/edit', async (req, res, next) => {
    const { id } = req.params;
    try {
        const requestedShop = await Shop.findById(id);
        res.render('shop/edit', { requestedShop })
    } catch (e) {
        next(new AppError('Barber shop not found. Try again'))
    }

})

app.put('/shop/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        geo.geocode('mapbox.places', req.body.shop.address, async (err, geoData) => {
            const updatedShop = await Shop.findByIdAndUpdate(id, req.body.shop);
            updatedShop.geometry = geoData.features[0].geometry;
            await updatedShop.save()
            res.redirect(`/shop/${id}`);
        });
    } catch (e) {
        next(new AppError('Couldn\'t update the requested barber shop. Try again'))
    }
})

app.get('/shop/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const requestedShop = await Shop.findById(id);
        res.render('shop/view', { shop: requestedShop })

    } catch (e) {
        next(new AppError('Couldn\'t find the requested shop. Try again'))
    }

})

app.delete('/shop/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await Shop.findByIdAndDelete(id);
        res.redirect('/');
    }
    catch (e) {
        next(new AppError('Couldn\'t find the shop to delete.'))
    }

})

app.post('/shop', async (req, res, next) => {
    const newShop = new Shop(req.body.shop);
    try {
        geo.geocode('mapbox.places', req.body.shop.address, async (err, geoData) => {
            newShop.geometry = geoData.features[0].geometry;
            await newShop.save()
            res.redirect('/');
        });
    } catch (e) {
        next(new AppError('Couldn\'t create a shop. Try again'))
    }

})

app.all('*', (req, res, next) => {
    next(new AppError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).render('error', { message, status });
})

app.listen(3000, () => {
    console.log('up');
})
