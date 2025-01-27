const User = require('../models/user');
const bcrypt = require('bcryptjs');

// unable to install validator.js as conflicting dependency with "express-graphql"

module.exports = {
  createUser: async function (args, req) {
    const { name, email, password } = args.userInput;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error('User already exists!');
      throw error;
    }

    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      name: name,
      password: hashedPw,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() }; // _doc is just data, without the meta data that mongoose adds automatically
  },
};
