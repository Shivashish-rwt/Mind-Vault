const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: "fullname or email or password is missing" });
    }

    try {
        const existedUser = await User.findOne({ email: email });
        if (existedUser) {
            return res.status(400).json({ error: "User already exist" });
        }

        const user = await User.create({
            fullName,
            email,
            password,
        })

        const createdUser = await User.findById(user._id).select("-password");
        const userObject = createdUser.toObject();

        const accessToken = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m"
        });

        return res.status(200).json({ message: "User registered successfully", createdUser, accessToken });
    } catch (err) {
        return res.status(500).json({ error: err?.message });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email or password is missing" });
    };

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        };

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(400).json({ error: "Invalid credentials" });
        };

        const userObject = user.toObject();
        delete userObject.password;

        const accessToken = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m"
        });

        return res.status(200).json({ message: "User logged in successfully", userObject, accessToken });
    } catch (err) {
        return res.status(500).json({ error: err?.message });
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        return res.status(200).json({ message: "User fetched successfully", user: req.user });
    } catch (err) {
        return res.status(500).json({ error: err?.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUser,
}