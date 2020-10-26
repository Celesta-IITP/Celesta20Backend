const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const caSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    code: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

caSchema.pre("save", async function (next) {
  try {
    /*SALTING AND HASHING*/

    //generate a salt
    const salt = await bcrypt.genSalt(10);

    //generate a password hash(salt+hash)
    const passwordHash = await bcrypt.hash(this.password, salt);

    //reassign hashed version over original plain text password
    this.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

caSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password); //returns boolean
  } catch (error) {
    throw new Error(error);
  }
};

const CA = mongoose.model("CA", caSchema);
module.exports = CA;
