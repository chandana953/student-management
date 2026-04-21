const crypto = require("crypto");

exports.generateId = () => {
    return crypto.randomUUID();
};