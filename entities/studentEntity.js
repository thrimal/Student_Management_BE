const { DataTypes } = require('sequelize');
const sequelize = require('../db/dbConnection');

const Student = sequelize.define('Student', {
    student_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'students',  // Table name
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at' 
});

module.exports = Student;
