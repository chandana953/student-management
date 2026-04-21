const studentService = require("../services/student.service");

exports.createStudent = async (req, res, next) => {
    try {
        const student = await studentService.createStudent(req.body);
        res.status(201).json(student);
    } catch (err) {
        next(err);
    }
};

exports.getAllStudents = async (req, res, next) => {
    try {
        const { page, limit, search } = req.query;
        const data = await studentService.getAllStudents({ page, limit, search });
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

exports.getStudentById = async (req, res, next) => {
    try {
        const student = await studentService.getStudentById(req.params.id);
        res.status(200).json(student);
    } catch (err) {
        next(err);
    }
};

exports.updateStudent = async (req, res, next) => {
    try {
        const updated = await studentService.updateStudent(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteStudent = async (req, res, next) => {
    try {
        await studentService.deleteStudent(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};