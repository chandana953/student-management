class Student {
    constructor({ id, name, age, course }) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.course = course;
        this.createdAt = new Date();
    }

    static validate(data) {
        const { name, age, course } = data;

        if (!name || typeof name !== "string") {
            return "Name is required and must be a string";
        }

        if (!age || typeof age !== "number") {
            return "Age must be a number";
        }

        if (!course || typeof course !== "string") {
            return "Course is required";
        }

        return null;
    }
}

module.exports = Student;