const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
    static associate(models) {
      Match.belongsTo(models.Team, { foreignKey: 'homeTeam', as: 'homeTeamDetails' });
      Match.belongsTo(models.Team, { foreignKey: 'awayTeam', as: 'awayTeamDetails' });
    }
  }
  Match.init({
    homeTeam: DataTypes.INTEGER,
    awayTeam: DataTypes.INTEGER,
    matchDate: DataTypes.DATE,
    score: {
      type: DataTypes.JSON,
      defaultValue: [0, 0],
    },
    finished:{
      type:DataTypes.BOOLEAN,
      defaultValue:false}
  }, {
    sequelize,
    modelName: 'Match',
  });
  return Match;
};
