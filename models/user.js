const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const USER_ROLES_ENUM = {
  USER: "USER",
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  ORGANIZER: "ORGANIZER",
  COORD: "COORD",
  SUBCOORD: "SUBCOORD",
  COMMITTEE: "COMMITTEE",
};

const userSchema = new Schema(
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
    profilePhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
    },
    college: {
      type: String,
      required: true,
    },
    sex: {
      type: Number, //0: default, 1: male, 2: female 3:other
      required: true,
    },
    roles: {
      type: [String],
      default: [USER_ROLES_ENUM.USER],
    },
    referralId: {
      type: String,
      default: "CLST0000",
    },
    celestaId: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
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

userSchema.pre("save", async function (next) {
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

userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password); //returns boolean
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("user", userSchema);
module.exports = {
  User,
  USER_ROLES_ENUM,
};
