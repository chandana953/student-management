const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema - Authentication Model
 * 
 * WHY: Separates user authentication data from application data
 * Stores credentials securely with password hashing
 * 
 * Security Features:
 * - Password hashing with bcrypt (salt rounds: 10)
 * - Email uniqueness validation
 * - Input validation
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Hash password before saving
 * WHY: We NEVER store plain text passwords
 * bcrypt adds salt automatically (protection against rainbow tables)
 */
userSchema.pre('save', async function() {
  // Only hash if password is modified
  if (!this.isModified('password')) return;
  
  try {
    // Generate salt (10 rounds = good balance of security/speed)
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    // No need to call next() in async Mongoose hooks - just return
  } catch (error) {
    // Throw error to stop save operation
    throw error;
  }
});

/**
 * Compare password method
 * WHY: Used during login to verify credentials
 * Compares plain text with hashed password
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Remove password from JSON output
 * WHY: Never expose password hash in API responses
 */
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
