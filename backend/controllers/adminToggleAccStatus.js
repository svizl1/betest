const User = require("../models/User");

const toggleStatus = async (req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle the account_enabled status
        user.account_enabled = !user.account_enabled; // Switch the status
        await user.save(); // Save the updated user

        res.status(200).json({ message: 'User status updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = toggleStatus;