const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

let courses = require('./curses');

const app = express();

//schema definition language
const schema = buildSchema(`
  type Course {
    id: ID!
    title: String!
    views:Int
  }
  type Alert {
    message: String
  }
  input CourseInput {
    title: String!
    views: Int
  }
  type Query {
    getCourses(page: Int, limit: Int = 1): [Course]
    getCourse(id: ID!): Course
  }
  type Mutation {
    addCourse(input: CourseInput): Course
    updateCourse(id: ID!, input: CourseInput): Course
    deleteCourse(id: ID!): Alert
  }
`); // template strings

const root = {
  getCourses({ page, limit }) {
    if(page !== undefined) {
      // inicia en pagina 0
      return courses.slice(page * limit, (page + 1) * limit);
      // inicia en pagina 1
      //return courses.slice((page - 1) * limit, (page) * limit);
    }
    return courses;
  },
  getCourse( { id } ) {
    console.log(id);
    return course = courses.find( (course) => id == course.id );
  },
  addCourse( { input } ) {
    const { title, views } = input;
    const id = String(courses.length + 1);
    const course = { id, ...input }; //spread operator - hace lo mismo que abajo
    //const course = { id, title, views };
    courses.push(course);
    return course;
  },
  updateCourse({id, input}) {
    const courseIndex = courses.findIndex((course) => id === course.id );
    const course = courses[courseIndex];
    /* PERMITE CONSTRUIR UN NUEVO OBJETO, si existe la modifica y si no existe la crea */
    const newCourse = Object.assign(course, input);
    course[courseIndex] = newCourse;
    return newCourse;
  },
  deleteCourse({id}) {
    courses = courses.filter((course) => course.id != id);
    return {
      message: `El curso con id ${id} ha sido eliminado`
    }
  }
}

app.get('/', function(req, res) {
  res.send(courses);
});

//middleware
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.listen(8080, function() {
  console.log("Servidor iniciado.")
});