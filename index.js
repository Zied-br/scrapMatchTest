const express = require('express');
require("dotenv").config();
const teamsRouter = require('./routes/team');
const matchesRouter = require('./routes/match');
const cors = require("cors");
const { sequelizeConnection } = require("./models/index");
const bodyParser = require("body-parser");


const app = express();

sequelizeConnection.sync({ force: false });
app.use(bodyParser.json());

app.set("view engine", "pug");
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

// Use routes
app.use('/teams', teamsRouter);
app.use('/matches', matchesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
