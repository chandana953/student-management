const Student = require("../models/student.model");
const { generateId } = require("../utils/idGenerator");

let students = [];

exports.createStudent = (data) => {
    const error = Student.validate(data);
    if (error) throw { status: 400, message: error };

    const newStudent = new Student({
        id: generateId(),
        ...data
    });

    students.push(newStudent);
    return newStudent;
};

exports.getAllStudents = (query) => {
    let result = [...students];

    // Search
    if (query.name) {
        result = result.filter(s =>
            s.name.toLowerCase().includes(query.name.toLowerCase())
        );
    }

    // Pagination
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 5;

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
        total: result.length,
        page,
        data: result.slice(start, end)
    };
};

exports.getStudentById = (id) => {
    const student = students.find(s => s.id === id);
    if (!student) throw { status: 404, message: "Student not found" };
    return student;
};

exports.updateStudent = (id, data) => {
    const student = students.find(s => s.id === id);
    if (!student) throw { status: 404, message: "Student not found" };

    Object.assign(student, data);
    return student;
};

exports.deleteStudent = (id) => {
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        throw { status: 404, message: "Student not found" };
    }

    const deleted = students.splice(index, 1);
    return deleted[0];
};