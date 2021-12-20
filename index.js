//APP INIT
import express from 'express';
import path from 'path';
const app = express();

app.get('/', (req, res) => {
    res.send('hello');
})

app.listen(3000, () => {
    console.log('up');
})
