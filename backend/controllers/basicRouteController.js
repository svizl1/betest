// Return Server Status
exports.default = (req, res) => {
  res.send("Server is running");
};

// Test Route for GET
exports.get = (req, res) => {
  res.json({ message: "GET request received" });
};

// Test Route for POST
exports.post = (req, res) => {
  res.json({ message: "POST request received" });
};

