const User = require('../models/Users_schema');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {
    register: async (req, res) => {
        try {
            console.log(req.body); // Log the request body to check what's being received
            const { firstName, lastName, email, password } = req.body;
            const error = validationResult(req);
            if (!error.isEmpty()) {
                console.log('Validation errors:', error.mapped()); // Log validation errors
                return res.status(400).json({ errors: error.mapped() });
            }
            const existEmail = await User.findOne({ email });
            if (existEmail) {
                return res.status(400).json({ message: 'Email already exists!' });
            }
            const hash = await bcrypt.hash(password, 10);
            const newUser = new User({ firstName, lastName, email, password: hash });
            await newUser.save();
            return res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ message: 'Server error', error });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const existUser = await User.findOne({ email });

            if (!existUser) {
                return res.status(404).json({ message: "Email not found!" });
            }

            const isMatch = await bcrypt.compare(password, existUser.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Wrong password' });
            }

            const payload = {
                id: existUser._id,
                firstName: existUser.firstName,
                lastName: existUser.lastName,
                email: existUser.email,
            };

            let accessToken;
            try {
                accessToken = await jwt.sign(
                    payload,
                    process.env.ACCESS_TOKEN,
                    { expiresIn: process.env.TOKEN_EXPIRE_IN }
                );
            } catch (jwtError) {
                console.error('JWT error:', jwtError);
                return res.status(500).json({ message: 'Token generation error' });
            }

            // Return both the access token and user details
            return res.json({
                accessToken,
                user: {
                    firstName: existUser.firstName,
                    lastName: existUser.lastName,
                    email: existUser.email
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Server error', error });
        }
    },

    // password: async (req, res) => {
    //     const { email } = req.body;

    //     try {
    //         // Find the user by email
    //         const user = await User.findOne({ email });
    //         if (!user) {
    //             return res.status(404).json({ message: 'User not found' });
    //         }

    //         // Generate a reset token
    //         const resetToken = generateResetToken(user._id);

    //         // Create a password reset link
    //         const resetLink = `http://your-frontend.com/reset-password/${resetToken}`;

    //         // Send email with the reset link
    //         const mailOptions = {
    //             from: 'your-email@gmail.com',
    //             to: user.email,
    //             subject: 'Password Reset Request',
    //             html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    //         };

    //         await transporter.sendMail(mailOptions);

    //         res.json({ message: 'Password reset link sent to your email' });
    //     } catch (error) {
    //         res.status(500).json({ message: 'Server error' });
    //     }
    // }
};

module.exports = userCtrl;
