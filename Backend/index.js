const express = require("express");
const app = express();
const movieRoutes = require('./routes/movieRoutes')
const authRoutes = require('./routes/authRoutes')
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

const PORT = 9000
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello");
});




app.use(passport.initialize());


app.use('/api/movies', movieRoutes);
app.use('/api/auth',authRoutes);



app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});