const express = require('express');

const hbs = require('hbs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/beers', async (req, res) => {
  try {
    const data = await fetch('https://ih-beers-api2.herokuapp.com/beers');
    const beers = await data.json();
    beers.splice(25);
    res.render('beers', { beers });
  } catch (err) {
    console.log('Error while Fetching beers ->: ', err);
  }
});

app.get('/add-beer', (req, res) => {
  res.render('add_beer', {});
});

app.get('/random-beer', async (req, res) => {
  try {
    const data = await fetch(
      'https://ih-beers-api2.herokuapp.com/beers/random'
    );
    const beer = await data.json();
    if (!beer.image_url) beer.image_url = './images/beer.png';
    res.render('beer_detail', { beer });
  } catch (err) {
    console.log('Error while fetching random beer ->:', err);
  }
});

app.get('/beer/:beer_id', async (req, res) => {
  try {
    const data = await fetch(
      `https://ih-beers-api2.herokuapp.com/beers/${req.params.beer_id}`
    );
    const beer = await data.json();
    if (!beer.image_url) beer.image_url = './images/beer.png';
    res.render('beer_detail', { beer, goback: true });
  } catch (err) {
    console.log('Error while fetching beer details ->:', err);
  }
});

app.listen(port, () => console.log(`🏃‍ on port ${port}`));
