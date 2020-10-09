'use strict';
module.exports = (sequelize, DataTypes) => {
  var reply = sequelize.define('reply', {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    writer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  });

  reply.associate = function(models){
    reply.belongsTo(models.post, {
      foreignKey: "postId"
    })
  };

  return reply;
};
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class reply extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   reply.init({
//     postId: DataTypes.INTEGER,
//     writer: DataTypes.STRING,
//     content: DataTypes.TEXT
//   }, {
//     sequelize,
//     modelName: 'reply',
//   });
//   return reply;
// };