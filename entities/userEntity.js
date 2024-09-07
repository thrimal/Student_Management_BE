const { DataTypes } = require('sequelize');
const sequelize = require('../db/dbConnection');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role:{
        type: DataTypes.STRING,
        allowNull:false
    }
}, {
    tableName: 'users',  // Table name
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at' 
});

module.exports = User;
