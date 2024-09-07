var express = require('express');
const Enrollment = require("../entities/enrollmentEntity");
const authenticateToken = require('../middleware/jwt');
var router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { enrollment_id, course_id, student_id, enrollment_date } = req.body;

    if (student_id === null || student_id === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found studentId", data: null });
      return;
    } else if (course_id === null || course_id === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found courseId", data: null });
      return;
    } else if (enrollment_id === null || enrollment_id === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found enrollmentId", data: null });
      return;
    } else if (enrollment_date === null || enrollment_date === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found enrollmentDate", data: null });
      return;
    }

    let enrollmentId = parseInt(enrollment_id);
    let studentId = parseInt(student_id);
    let courseId = parseInt(course_id);

    let enrollment = await Enrollment.findOne({ where: { enrollment_id: enrollmentId } });

    if (enrollment) {
      enrollment.student_id = studentId;
      enrollment.course_id = courseId;
      enrollment.enrollment_date = enrollment_date;
      await enrollment.save();
      res.status(200).json({
        hasError: false,
        message: "Enrollment update successfully",
        data: enrollment,
      });
    } else {
      const enrollment = await Enrollment.create({
        enrollment_id: enrollmentId,
        student_id: studentId,
        course_id: courseId,
        enrollment_date: enrollment_date,
      });
      res.status(201).json({
        hasError: false,
        message: "Enrollment create successfully",
        data: enrollment,
      });
    }
  } catch (error) {
    console.log("Error processing request:", error);
    res.status(500).json({ hasError: true, message: error, data: null });
  }
}); 

router.get('/', authenticateToken, async (req, res) => {
    try {
      const enrollments = await Enrollment.findAll();
      res.status(200).json({
        hasError: false,
        message: 'Enrollments retrieved successfully',
        data: enrollments
      });
    } catch (error) {
      console.error('Error retrieving enrollments:', error);
      res.status(500).json({
        hasError: true,
        message: 'Failed to retrieve enrollments',
        data: null
      });
    }
  });

  router.delete('/:enrollment_id', authenticateToken, async (req, res) => {
    try { 
      const { enrollment_id } = req.params;
      const enrollmentId = parseInt(enrollment_id);
  
      const enrollment = await Enrollment.findByPk(enrollmentId);
  
      if (enrollment) {
        await enrollment.destroy();
        res.status(200).json({
          hasError: false,
          message: 'Enrollment deleted successfully',
          data: null
        });
      } else {
        res.status(404).json({
          hasError: true,
          message: 'Enrollment not found',
          data: null
        });
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      res.status(500).json({
        hasError: true,
        message: 'Failed to delete enrollment',
        data: null
      });
    }
  });

  router.get("/:enrollment_id", authenticateToken, async (req, res) => {
    try {
      const { enrollment_id } = req.params;
      const enrollmentId = parseInt(enrollment_id);
  
      const enrollment = await Enrollment.findByPk(enrollmentId);
  
      if (enrollment) {
        res.status(200).json({
          hasError: false,
          message: "Enrollment found",
          data: enrollment,
        });
      } else {
        res.status(404).json({
          hasError: true,
          message: "Enrollment not found",
          data: null,
        });
      }
    } catch (error) {
      console.error("Error finding enrollment:", error);
      res.status(500).json({
        hasError: true,
        message: "Failed to find enrollment",
        data: null,
      });
    }
  });

module.exports = router;