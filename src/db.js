require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// dotenv
const {
  DATABASE_URL
} = process.env;

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Product, Category , User, Role, RefreshToken , Review , Question} = sequelize.models;



Product.belongsTo(Category);
Category.hasMany(Product, { foreignKey: 'categoryId' });

Product.belongsToMany(User, { through: 'user_product' })
User.belongsToMany(Product, { through: 'user_product' })

Question.belongsTo(Product);
Product.hasMany(Question, { foreignKey: 'productId' });

Review.belongsTo(Product);
Product.hasMany(Review);

Role.belongsToMany(User, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
User.belongsToMany(Role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

RefreshToken.belongsTo(User, {
  foreignKey: 'userId', targetKey: 'id'
});
User.hasOne(RefreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};