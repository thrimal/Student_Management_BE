var express = require("express");
const Enrollment = require("../entities/enrollmentEntity");
const authenticateToken = require("../middleware/jwt");
var router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const enrollmentArray = req.body.enrollments;

    if (!Array.isArray(enrollmentArray) || enrollmentArray.length < 1) {
      return res.status(400).json({
        hasError: true,
        message: "Invalid input data: Array of enrollments is required",
      });
    }

    const savedEnrollments = await Promise.all(
      enrollmentArray.map(async (enrollment) => {
        const { enrollment_id, course_id, user_id, enrollment_date } = enrollment;

        if (!user_id || user_id === null || user_id === "" || isNaN(user_id)) {
          throw new Error("User ID is required");
        }
        if (!course_id || course_id === null || course_id === "" || isNaN(course_id)) {
          throw new Error("Course ID is required");
        }
        if (enrollment_id === null || enrollment_id === undefined || isNaN(enrollment_id)) {
          throw new Error("Enrollment ID is required");
        }
        if (!enrollment_date) {
          throw new Error("Enrollment Date is required");
        }

        let enrollmentId = parseInt(enrollment_id);
        let userId = parseInt(user_id);
        let courseId = parseInt(course_id);

        let existingEnrollment = await Enrollment.findOne({
          where: { enrollment_id: enrollmentId },
        });

        if (existingEnrollment) {
          existingEnrollment.user_id = userId;
          existingEnrollment.course_id = courseId;
          existingEnrollment.enrollment_date = enrollment_date;
          await existingEnrollment.save();
          return existingEnrollment; 
        } else {
          const newEnrollment = await Enrollment.create({
            enrollment_id: enrollmentId,
            user_id: userId,
            course_id: courseId,
            enrollment_date: enrollment_date,
          });
          return newEnrollment;
        }
      })
    );

    return res.status(201).json({
      hasError: false,
      message: "Enrollments processed successfully",
      data: savedEnrollments,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ hasError: true, message: error.message, data: null });
  }
});


router.get("/", authenticateToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll();
    res.status(200).json({
      hasError: false,
      message: "Enrollments retrieved successfully",
      data: enrollments,
    });
  } catch (error) {
    console.error("Error retrieving enrollments:", error);
    res.status(500).json({
      hasError: true,
      message: "Failed to retrieve enrollments",
      data: null,
    });
  }
});

router.delete("/:enrollment_id", authenticateToken, async (req, res) => {
  try {
    const { enrollment_id } = req.params;
    const enrollmentId = parseInt(enrollment_id);

    const enrollment = await Enrollment.findByPk(enrollmentId);

    if (enrollment) {
      await enrollment.destroy();
      res.status(200).json({
        hasError: false,
        message: "Enrollment deleted successfully",
        data: null,
      });
    } else {
      res.status(404).json({
        hasError: true,
        message: "Enrollment not found",
        data: null,
      });
    }
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    res.status(500).json({
      hasError: true,
      message: "Failed to delete enrollment",
      data: null,
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
