const studentService = require("../services/student.service");
const { emitStudentCreated, emitStudentUpdated, emitStudentDeleted } = require('../config/socket');

/**
 * Student Controller with Real-Time Updates
 * 
 * WHY: Emits WebSocket events after CRUD operations
 * Allows all connected clients to receive instant updates
 */

exports.createStudent = async (req, res, next) => {
    try {
        const student = await studentService.createStudent(req.body);
        
        // Emit real-time event to all connected clients
        emitStudentCreated(student);
        
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
        
        // Emit real-time update event
        emitStudentUpdated(updated);
        
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteStudent = async (req, res, next) => {
    try {
        const studentId = req.params.id;
        await studentService.deleteStudent(studentId);
        
        // Emit real-time delete event
        emitStudentDeleted(studentId);
        
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};