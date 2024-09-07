const express = require("express");
const Course = require("../entities/courseEntity");
const authenticateToken = require('../middleware/jwt'); 
const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { course_id, title, description, start_date, end_date } = req.body;

    if (course_id === null || course_id === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found courseId", data: null });
      return;
    } else if (title === null || title === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found title", data: null });
      return;
    } else if (description === null || description === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found description", data: null });
      return;
    } else if (start_date === null || start_date === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found startDate", data: null });
      return;
    } else if (end_date === null || end_date === "") {
      res
        .status(400)
        .json({ hasError: true, message: "Not found endDate", data: null });
      return;
    }

    let courseId = parseInt(course_id);

    let course = await Course.findOne({ where: { course_id: courseId } });

    if (course) {
      course.title = title;
      course.description = description;
      course.start_date = start_date;
      course.end_date = end_date;
      await course.save();
      res.status(200).json({
        hasError: false,
        message: "Course update successfully",
        data: course,
      });
    } else {
      const course = await Course.create({
        course_id: courseId,
        title: title,
        description: description,
        start_date: start_date,
        end_date: end_date,
      });
      res.status(201).json({
        hasError: false,
        message: "Course create successfully",
        data: course,
      });
    }
  } catch (error) {
    console.log("Error processing request:", error);
    res.status(500).json({ hasError: true, message: error, data: null });
  }
});

router.get("/",authenticateToken, async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json({
      hasError: false,
      message: "Courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error retrieving courses:", error);
    res.status(500).json({
      hasError: true,
      message: "Failed to retrieve courses",
      data: null,
    });
  }
});

router.delete('/:course_id', authenticateToken, async (req, res) => {
  try { 
    const { course_id } = req.params;
    const courseId = parseInt(course_id);
    const course = await Course.findByPk(courseId);

    if (course) {
      await course.destroy();
      res.status(200).json({
        hasError: false,
        message: 'Course deleted successfully',
        data: null
      });
    } else {
      res.status(404).json({
        hasError: true,
        message: 'Course not found',
        data: null
      });
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      hasError: true,
      message: 'Failed to delete course',
      data: null
    });
  }
});

router.get("/:course_id", authenticateToken, async (req, res) => {
  try {
    const { course_id } = req.params;
    const courseId = parseInt(course_id);

    const course = await Course.findByPk(courseId);

    if (course) {
      res.status(200).json({
        hasError: false,
        message: "Course found",
        data: course,
      });
    } else {
      res.status(404).json({
        hasError: true,
        message: "Course not found",
        data: null,
      });
    }
  } catch (error) {
    console.error("Error finding course:", error);
    res.status(500).json({
      hasError: true,
      message: "Failed to find course",
      data: null,
    });
  }
});

module.exports = router;
