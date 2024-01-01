const { models } = require("../models/index");

// add teams
const addTeams = async (req, res) => {
  try {
    const teamNames = req.body;  

    // Create teams and save them to the database
    const createdTeams = await Promise.all(teamNames.map(async (teamName) => {
      const createdTeam = await models.Team.create({ teamName });
      return createdTeam;
    }));

    res.status(200).json(createdTeams);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
    addTeams,
  };
  