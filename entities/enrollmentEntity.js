const { DataTypes } = require('sequelize');
const sequelize = require('../db/dbConnection');

const Enrollment = sequelize.define('Enrollment', {
    enrollment_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    course_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    student_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    enrollment_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'enrollments',  // Table name
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at' 
});

module.exports = Enrollment;
