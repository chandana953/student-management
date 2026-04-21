const Student = require("../models/student.model");

module.exports = (req, res, next) => {
    const error = Student.validate(req.body);
    if (error) {
        return res.status(400).json({ error });
    }
    next();
};