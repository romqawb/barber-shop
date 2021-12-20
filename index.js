import express from 'express';
var app = express();


//something changed!



app.get('/', (req, res) => {
    res.send('hello');
})

app.listen(3000, () => {
    console.log('up');
})
