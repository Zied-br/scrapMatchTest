const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      Team.hasMany(models.Match, { foreignKey: 'homeTeam', as: 'homeMatches' });
      Team.hasMany(models.Match, { foreignKey: 'awayTeam', as: 'awayMatches' });
    }
  }
  Team.init({
    teamName: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};
