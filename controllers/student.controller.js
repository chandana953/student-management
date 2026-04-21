const studentService = require("../services/student.service");

exports.createStudent = (req, res, next) => {
    try {
        const student = studentService.createStudent(req.body);
        res.status(201).json(student);
    } catch (err) {
        next(err);
    }
};

exports.getAllStudents = (req, res, next) => {
    try {
        const data = studentService.getAllStudents(req.query);
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

exports.getStudentById = (req, res, next) => {
    try {
        const student = studentService.getStudentById(req.params.id);
        res.status(200).json(student);
    } catch (err) {
        next(err);
    }
};

exports.updateStudent = (req, res, next) => {
    try {
        const updated = studentService.updateStudent(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteStudent = (req, res, next) => {
    try {
        const deleted = studentService.deleteStudent(req.params.id);
        res.status(200).json(deleted);
    } catch (err) {
        next(err);
    }
};