'use strict';
module.exports = (sequelize, DataTypes) => {
  var post = sequelize.define('post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    writer: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  post.associate = function (models) {
    post.hasMany(models.reply);
  };

  return post;
};
// module.exports = (sequelize, DataTypes) => {
//   var post = sequelize.define('post', {
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     writer: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     }
//   });
//   return post;
// };


  // const {
  //   Model
  // } = require('sequelize');
  // class post extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // post.init({
  //   title: DataTypes.STRING,
  //   writer: DataTypes.STRING
  // }, {
  //   sequelize,
  //   modelName: 'post',
  // });
  // return post;
