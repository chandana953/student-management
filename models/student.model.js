class Student {
    constructor({ id, name, age, course, imageUrl }) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.course = course;
        this.imageUrl = imageUrl || null; // Cloudinary image URL
        this.createdAt = new Date();
    }

    static validate(data) {
        const { name, age, course, imageUrl } = data;

        if (!name || typeof name !== "string") {
            return "Name is required and must be a string";
        }

        if (!age || typeof age !== "number") {
            return "Age must be a number";
        }

        if (!course || typeof course !== "string") {
            return "Course is required";
        }

        // imageUrl is optional but must be a string if provided
        if (imageUrl && typeof imageUrl !== "string") {
            return "Image URL must be a string";
        }

        return null;
    }
}

module.exports = Student;