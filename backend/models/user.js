const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number
  },
  famille: {
    type: String
  },
  race: {
    type: String
  },
  nourriture: {
    type: String
  },
  deletedAt: {
    default: null,
    type: Date
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'

    }
  ]

}, {
  collection: 'users',
  timestamps: true,

});


// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  let user = await User.findOne({ email: this.email }).populate({ path: "friends", match: { 'deleted_at': null } });
  if (user) {
    throw new Error('Signup failed: Email already exists');
  } else {
    next();
  }

});

// static method to login user
userSchema.statics.login = async function (email, password) {
  let user = await this.findOne({ email }).populate({ path: "friends", match: { 'deleted_at': null } });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error('Incorrect password');

  }
  throw new Error('Incorrect confidentials');

};




const User = mongoose.model('user', userSchema);

module.exports = User;