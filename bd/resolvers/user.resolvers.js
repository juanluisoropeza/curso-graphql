const User = require('../models/user');
const Course = require('../models/course');
module.exports = {
  Query: {
    async getUsers() {
      /*let users = User.find()
      if(page !== undefined) {
        users = users.limit(limit).skip((page - 1) * limit);
      }      
      return await users;*/
      return await User.find();
    },
    async getUser(obj, { id }) {
      return await User.findById(id);
    }
  },
  Mutation: {
    async signUp(obj, { input }) {
      const user = new User(input);
      await user.save();
      return user;
    },
    async logIn(obj, { input } ) {
      try {
        const user = User.authenticate(input);
        return user;
      } catch (error) {
        console.log(error);
        return null;
      }
    }
  },
  User: {
    async courses(u) {
      return await Course.find({ user: u.id });
    }
  }
};