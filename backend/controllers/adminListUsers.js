const User = require("../models/User");

const listUsers = async (req, res) => {

  try {
      const users = await User.find().select('-password -_id'); // Exclude pw & JWT id
      res.status(200).json(users); // Send the list of users as JSON
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  
module.exports = listUsers;
