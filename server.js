const express = require('express');
const jsonServer = require('json-server');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const jsonServerApp = jsonServer.create();
const jsonRouter = jsonServer.router('songs.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/audiahub', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a user schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(middlewares);

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle login
// Handle login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Find the user in the database
      const user = await User.findOne({ username, password });

      if (user) {
          // Redirect to first.html upon successful login
          res.redirect('/first.html');
      } else {
          res.send('Invalid username or password');
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});


// Serve the signup page
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

// Handle signup
// Handle signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Check if the username already exists
      const existingUser = await User.findOne({ username });

      if (existingUser) {
          res.send('Username already exists. Please choose a different username.');
      } else {
          // Create a new user in the database
          const newUser = new User({ username, password });
          await newUser.save();
          // Redirect to first.html upon successful signup
          res.redirect('/first.html');
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});



// Serve the first.html page
app.get('/first.html', (req, res) => {
    res.sendFile(__dirname + '/first.html');
});

// Use json-server routes
app.use('/api', jsonRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
