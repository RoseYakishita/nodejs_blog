const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');

const path = require('path');
const app = express();
const port = 3000;

const route = require('./routes/');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// View Engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
  }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './resources/views'));

// Middleware
app.use(morgan('combined'));

// Route
route(app);

// Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
