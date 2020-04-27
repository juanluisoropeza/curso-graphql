// Colecciones => tablas
// Documentos => filas

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../libs/env').secret;

const userSchema = new mongoose.Schema({
  email: String,
  hashedPassword: {
    type: String
  },
  token: String,
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

// encriptar password
userSchema.virtual('password');
userSchema.pre('validate', async function() {
  if(this.password === undefined) return;
  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.hashedPassword = hash;
  } catch(err) {
    console.log('Error', err);
  }
});

// User.autenticate()
userSchema.statics.authenticate = async function( {email, password} ) {
  const user = await this.findOne( { email } );
  if(!user) throw new Error('Email or password are wrong!');

  const result = await bcrypt.compare(password, user.hashedPassword);
  if(!result) throw new Error('Email or password are wrong!');

  // JSON web tokens
  user.token = jwt.sign({ id: user.id }, secret);
  await user.save();
  return user;
};

module.exports = mongoose.model('User', userSchema);