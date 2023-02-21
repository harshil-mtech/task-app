const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,

      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid Email");
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) throw new Error("Age must be a positive number");
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error("Passoword should not contain term `password`.");
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: Buffer,
  },
  {
    timestamps: true,
  }
);

// Stores task model objects created by particular user virtually(not in db)
// And tasks created by this user is available using user.populate('tasks') method
userSchema.virtual("tasks", {
  ref: "task",
  localField: "_id",
  foreignField: "owner",
});

// methods is used to store methods to instance of model object
// This method is used to generate authentication tokens for users
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = await jwt.sign(
    { _id: user._id.toString() },
    "thisisnodejscourse"
  );

  user.tokens.push({ token });
  await user.save();

  return token;
};

// To get public data of user by not returning password
userSchema.methods.toJSON = function () {
  const user = this;

  const publicProfile = user.toObject();

  delete publicProfile.password;
  delete publicProfile.tokens;
  delete publicProfile.avatar;

  return publicProfile;
};

// statics is used to store functions to model class and every instance of model class can access it.
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Unable to login");

  const isMatch = await bycrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Unable to login");

  return user;
};

// Middleware Hashing the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bycrypt.hash(user.password, 8);
  }

  next();
});

// Middleware to delete all the tasks created by user which is deleted
userSchema.post("remove", async function (next) {
  const user = this;

  await task.deletemany({ owner: user._id });
});

const user = mongoose.model("user", userSchema);

module.exports = user;
