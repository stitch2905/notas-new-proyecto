// Importar las librerías necesarias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Crear la aplicación Express
const app = express();
// Middleware: funciones que procesan las peticiones
app.use(cors()); // Permite peticiones desde otros orígenes
app.use(express.json()); // Permite recibir datos en formato JSON
// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/todoapp')
.then(() => console.log('■ Conectado a MongoDB'))
.catch(err => console.error('■ Error conectando a MongoDB:', err));
// Definir el esquema de las tareas
const tareaSchema = new mongoose.Schema({
titulo: { type: String, required: true },
completada: { type: Boolean, default: false },
fechaCreacion: { type: Date, default: Date.now }
});
// Crear el modelo basado en el esquema
const Tarea = mongoose.model('Tarea', tareaSchema);
// RUTAS DEL API
// 1. Obtener todas las tareas
app.get('/api/tareas', async (req, res) => {
try {
const tareas = await Tarea.find();
res.json(tareas);
} catch (error) {
res.status(500).json({ mensaje: 'Error al obtener tareas' });
}
});
// 2. Crear una nueva tarea
app.post('/api/tareas', async (req, res) => {
try {
const nuevaTarea = new Tarea({
titulo: req.body.titulo
});
const tareaGuardada = await nuevaTarea.save();
res.status(201).json(tareaGuardada);
} catch (error) {
res.status(400).json({ mensaje: 'Error al crear tarea' });
}
});
// 3. Actualizar una tarea (marcar como completada)
app.put('/api/tareas/:id', async (req, res) => {
try {
const tareaActualizada = await Tarea.findByIdAndUpdate(

req.params.id,
{ completada: req.body.completada },
{ new: true }
);
res.json(tareaActualizada);
} catch (error) {
res.status(400).json({ mensaje: 'Error al actualizar tarea' });
}
});
// 4. Eliminar una tarea
app.delete('/api/tareas/:id', async (req, res) => {
try {
await Tarea.findByIdAndDelete(req.params.id);
res.json({ mensaje: 'Tarea eliminada' });
} catch (error) {
res.status(400).json({ mensaje: 'Error al eliminar tarea' });
}
});
// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
console.log(`■ Servidor corriendo en http://localhost:${PORT}`);
});