const CA = require("../models/ca");

const registerCA = async (req, res) => {
  try {
    const { email, password, phone, name, college } = req.body;
    if (!email || !password || !phone || !name || !college) {
      return res.status(400).json({ message: "Please fill all the details" });
    }
    const ca = new CA({
      email,
      name,
      phone,
      password,
      college,
    });
    await ca.save();
    res.status(200).json({ ca });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerCA,
};
