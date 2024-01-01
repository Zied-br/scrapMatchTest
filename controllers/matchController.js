const { models } = require("../models/index");
const sequelize = require("sequelize");
const { scrapingMatches } = require("../scraping/scrapingMatches");
const cron = require("node-cron");

// Get all matches
const getAllMatches = async (req, res) => {
  try {
    const matches = await models.Match.findAll({});
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Scrap matches
const getResults = async () => {
  try {
    const results = await scrapingMatches(
      process.env.LINK
    );

    const matchesData = JSON.parse(results);
    for (const result of matchesData) {
      const homeTeam = await models.Team.findOne({ where: { teamName: result.homeTeam } });
      const awayTeam = await models.Team.findOne({ where: { teamName: result.awayTeam } });

      await models.Match.update(
        {
          score: result.endResult,
          finished: true,
        },
        {
          where: {
            [sequelize.Op.and]: [
              { homeTeam: homeTeam.id },
              { awayTeam: awayTeam.id },
            ],
          },
        }
      );
    }

    console.log('Results updated successfully');
  } catch (error) {
    console.error(error);
  }
};

/* // Schedule cron job to run getResults every day at 22:00
cron.schedule('0 22 * * *', () => {
  getResults();
}); */

// Schedule cron job to run getResults every 30 minutes
cron.schedule('*/30 * * * *', () => {
  getResults();
});

module.exports = {
  getAllMatches,
  getResults
};
