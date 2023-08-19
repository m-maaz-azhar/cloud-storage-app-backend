const bcrypt = require('bcrypt');
const User = require('../models/user.model');

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (user) {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(400).json({ error: 'Invalid password', ok: false });
            }
            delete user.password;
            res.status(200).json({ user, ok: true });
        } else {
            res.status(404).json({ error: "User not Found", ok: false });
        }
    } catch (err) {
        res.status(500).json({ error: err.message, ok: false });
    }
}

exports.registerUser = async (req, res) => {
    try {
        const checkUser = await User.findOne({ email: req.body.email });
        if (checkUser) {
            return res.status(400).json({ error: 'User already exists', ok: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();
        res.status(200).json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message, ok: false });
    }
}