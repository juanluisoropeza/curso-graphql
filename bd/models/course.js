// Colecciones => tablas
// Documentos => filas

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    views: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
});

module.exports = mongoose.model('Course', courseSchema);