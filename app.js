const express = require('express');
const bodyParser = require('body-parser');

const hbs = require('hbs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const base_api_url = 'https://ih-beers-api2.herokuapp.com/beers';

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/beers', async (req, res) => {
  try {
    const data = await fetch(base_api_url);
    const beers = await data.json();
    // beers.splice(25);
    res.render('beers', { beers });
  } catch (err) {
    console.log('Error while Fetching beers ->: ', err);
  }
});

app.get('/add-beer', (req, res) => {
  res.render('add_beer', {});
});

app.post('/add-beer', async (req, res) => {
  try {
    const data = await fetch(base_api_url + '/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const newBeer = await data.json();

    if (data.ok && newBeer.message) {
      res.render('add_beer', { added: newBeer.message });
    }
  } catch (err) {
    console.log('Error Adding New Beer ->: ', err);
  }
});

app.get('/random-beer', async (req, res) => {
  try {
    const data = await fetch(base_api_url + '/random');
    const beer = await data.json();
    if (!beer.image_url) beer.image_url = './images/beer.png';
    res.render('beer_detail', { beer });
  } catch (err) {
    console.log('Error while fetching random beer ->:', err);
  }
});

app.get('/beer/:beer_id', async (req, res) => {
  try {
    const data = await fetch(`${base_api_url}/${req.params.beer_id}`);
    const beer = await data.json();
    if (!beer.image_url) beer.image_url = './images/beer.png';
    res.render('beer_detail', { beer, goback: true });
  } catch (err) {
    console.log('Error while fetching beer details ->:', err);
  }
});

app.listen(port, () => console.log(`🏃‍ on port ${port}`));
