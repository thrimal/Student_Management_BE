const express = require("express");
const Student = require("../entities/studentEntity");
const authenticateToken = require('../middleware/jwt');

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { student_id, dob, address, phone } = req.body;

    if (student_id === null || student_id === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found studentId", data: null });
      return;
    } else if (dob === null || dob === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found dob", data: null });
      return;
    } else if (address === null || address === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found address", data: null });
      return;
    } else if (phone === null || phone === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found phone", data: null });
      return;
    }

    let studentId = parseInt(student_id);

    let student = await Student.findOne({ where: { student_id: studentId } });

    if (student) {
      student.dob = dob;
      student.address = address;
      student.phone = phone;
      await student.save();
      res.status(200).json({
        hasError: false,
        message: "Student update successfully",
        data: student,
      });
    } else {
      const student = await Student.create({
        student_id: studentId,
        dob: dob,
        address: address,
        phone: phone,
      });
      res.status(201).json({
        hasError: false,
        message: "Student create successfully",
        data: student,
      });
    }
  } catch (error) {
    console.log("Error processing request:", error);
    res.status(500).json({ hasError: true, message: error, data: null });
  }
}); 

router.get('/', async (req, res) => {
    try {
      const students = await Student.findAll();
      res.status(200).json({
        hasError: false,
        message: 'Students retrieved successfully',
        data: students
      });
    } catch (error) {
      console.error('Error retrieving Students:', error);
      res.status(500).json({
        hasError: true,
        message: 'Failed to retrieve Students',
        data: null
      });
    }
  });

  router.delete('/:student_id', async (req, res) => {
    try { 
      const { student_id } = req.params;
      const studentId = parseInt(student_id);
  
      const student = await Student.findByPk(studentId);
  
      if (student) {
        await student.destroy();
        res.status(200).json({
          hasError: false,
          message: 'Student deleted successfully',
          data: null
        });
      } else {
        res.status(404).json({
          hasError: true,
          message: 'Student not found',
          data: null
        });
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({
        hasError: true,
        message: 'Failed to delete student',
        data: null
      });
    }
  });

  router.get("/:student_id", async (req, res) => {
    try {
      const { student_id } = req.params;
      const studentId = parseInt(student_id);
  
      const student = await Student.findByPk(studentId);
  
      if (student) {
        res.status(200).json({
          hasError: false,
          message: "Student found",
          data: student,
        });
      } else {
        res.status(404).json({
          hasError: true,
          message: "Student not found",
          data: null,
        });
      }
    } catch (error) {
      console.error("Error finding student:", error);
      res.status(500).json({
        hasError: true,
        message: "Failed to find student",
        data: null,
      });
    }
  });

module.exports = router;
