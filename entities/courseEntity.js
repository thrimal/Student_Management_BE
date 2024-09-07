const { DataTypes } = require('sequelize');
const sequelize = require('../db/dbConnection');

const Course = sequelize.define('Course', {
    course_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    end_date:{
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'courses',  // Table name
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at' 
});

module.exports = Course;
