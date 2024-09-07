const { Sequelize } = require('sequelize');

// Initialize Sequelize with MySQL connection
const sequelize = new Sequelize('STUDENT_MANAGEMENT_SYSTEM', 'root', 'ijse', {
  host: 'localhost',
  dialect: 'mysql', 
  logging: false 
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
