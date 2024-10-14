const Contact = require('../models/contact');
const User = require('../models/User'); // Import the User model

const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Validate that the username and email match
    const user = await User.findOne({ username: name, email: email });
    if (!user) {
      return res.status(400).json({ message: "Username and email do not match." });
    }

    // Check for existing unanswered messages
    const existingMessage = await Contact.findOne({
      name: name,
      email: email,
      responded: false // Assuming 'responded' is a field indicating if the message has been responded to
    });

    if (existingMessage) {
      return res.status(400).json({ message: "You have an unanswered message. Please wait for a response before submitting another." });
    }

    // Create a new contact entry in the database
    const contactEntry = new Contact({ name, email, message });
    await contactEntry.save();

    res.status(201).json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ message: "An error occurred. Please try again later." });
  }
};

module.exports = submitContactForm;
