const Course = require('../models/course');
const User = require('../models/user');
module.exports = {
  Query: {
    async getCourses(obj, { page, limit }, context) {
      console.log(context);
      // populate reemplaza el id del usuario por otro atributo, en este caso el correo electronico, pero podria ser el nombre si lo hubiese
      let courses = Course.find();
      if(page !== undefined) {
        courses = courses.limit(limit).skip((page - 1) * limit);
      }
      
      return await courses;
    },
    async getCourse( obj, { id } ) {
      const course = await Course.findById(id);
      return course;
    }
  },
  Mutation: {
    async addCourse(obj, { input, user }, context) {
      // si un usuario no esta logeado retorna nulo o envias un error
      // if(!context || context.currentUser) return null;
      const userObj = await User.findById(user);
      const course = new Course({ ...input, user });
      await course.save();
      userObj.courses.push(course);
      await userObj.save();
      return course;
    },
    async updateCourse(obj, {id, input}) {
      const course = await Course.findByIdAndUpdate(id, input);
      return course;
    },
    async deleteCourse(obj, {id}) {
      await Course.deleteOne({ _id: id });
      return {
        message: `El curso con id ${id} ha sido eliminado`
      }
    }
  },
  Course: {
    async user(c) {
      return await User.findById(c.user)
    }
  }
};