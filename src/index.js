const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');

const path = require('path');
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));
// View Engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './resources/views'));

// Middleware
app.use(morgan('combined'));

// Route
app.get('/', (req, res) => {
  res.render('home');
});
app.get('/about', (req, res) => {
  res.render('about');
});

// Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});