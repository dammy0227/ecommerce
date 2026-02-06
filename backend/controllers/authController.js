import User from '../models/User.js'
import { comparePassword, hashPassword } from '../utils/bcrypt.js'
import { generateToken } from '../utils/jwt.js'
import { validationResult } from 'express-validator'

// ✅ Register User
export const registerUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { fullName, email, password } = req.body

    // Check if email already exists
    const userExist = await User.findOne({ email })
    if (userExist) {
      return res.status(400).json({ success: false, message: 'Email already exists' })
    }

    const hashedPassword = await hashPassword(password)

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    })

    const token = generateToken({ id: user._id, role: user.role })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error('Register Error', error.message)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
}

// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const token = generateToken({ id: user._id, role: user.role })

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error('Login Error:', error.message)
    res.status(500).json({ success: false, message: 'Server error during login' })
  }
}
