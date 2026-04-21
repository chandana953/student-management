const express = require("express");
const controller = require("../controllers/student.controller");
const validate = require("../middlewares/validation.middleware");

const router = express.Router();

router.post("/", validate, controller.createStudent);
router.get("/", controller.getAllStudents);
router.get("/:id", controller.getStudentById);
router.put("/:id", validate, controller.updateStudent);
router.delete("/:id", controller.deleteStudent);

module.exports = router;