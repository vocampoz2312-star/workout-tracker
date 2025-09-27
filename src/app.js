const express = require("express"); 
const app = express(); 
const { port } = require('./config/env'); 

// Inicializacion del servidor y primera ruta
app.get("/", (req, res) => {
  res.send("Hola mi server en Express");
});

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Middleware global para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ================== RECURSOS PRINCIPALES ==================

// Datos simulados
const users = [
  {id: 1, name: "Vanessa", email: "vanessa@example.com"},
  {id: 2, name: "Santiago", email: "santy@example.com"},
  {id: 3, name: "Juan", email: "juan@example.com"},
  {id: 4, name: "Andrés", email: "andres@example.com"}
];

const exercises = [
  {id: 1, name: "Sentadillas", category: "fuerza", muscle: "piernas"},
  {id: 2, name: "Correr", category: "cardio", muscle: "full body"},
  {id: 3, name: "Flexiones", category: "fuerza", muscle: "pecho"}
];

const plans = [
  {id: 1, userId: 1, name: "Rutina Full Body"},
  {id: 2, userId: 2, name: "Rutina Piernas"},
  {id: 3, userId: 1, name: "Rutina Cardio"}
];

const sessions = [
  {id: 1, planId: 1, date: "2025-09-20", time: "08:00"},
  {id: 2, planId: 1, date: "2025-09-21", time: "19:00"},
  {id: 3, planId: 2, date: "2025-09-22", time: "10:00"}
];

const reports = [
  {id: 1, userId: 1, start: "2025-09-01", end: "2025-09-15", summary: "Buen progreso", sessions: 5, calories: 2000},
  {id: 2, userId: 2, start: "2025-08-01", end: "2025-08-30", summary: "Constante", sessions: 8, calories: 3500}
];

// ================== GET USERS ==================

// Listar todos los usuarios con límite opcional
app.get('/users', (req, res) => {
  const { limit } = req.query;
  if (limit) return res.json(users.slice(0, Number(limit)));
  res.json(users);
});

// Obtener usuario por ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user);
});

// ================== GET EXERCISES ==================

// Listar ejercicios con filtro opcional por categoría
app.get('/exercises', (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = exercises.filter(e => e.category === category);
    return res.json(filtered);
  }
  res.json(exercises);
});

// Obtener ejercicio por ID
app.get('/exercises/:id', (req, res) => {
  const exercise = exercises.find(e => e.id === Number(req.params.id));
  if (!exercise) return res.status(404).json({ error: "Ejercicio no encontrado" });
  res.json(exercise);
});

// ================== GET PLANS ==================

// Listar planes, filtrando por usuario
app.get('/plans', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const filtered = plans.filter(p => p.userId === Number(userId));
    return res.json(filtered);
  }
  res.json(plans);
});

// Obtener plan por ID
app.get('/plans/:id', (req, res) => {
  const plan = plans.find(p => p.id === Number(req.params.id));
  if (!plan) return res.status(404).json({ error: "Plan no encontrado" });
  res.json(plan);
});

// ================== GET SESSIONS ==================

// Listar sesiones, filtrando por plan
app.get('/sessions', (req, res) => {
  const { planId } = req.query;
  if (planId) {
    const filtered = sessions.filter(s => s.planId === Number(planId));
    return res.json(filtered);
  }
  res.json(sessions);
});

// Obtener sesión por ID
app.get('/sessions/:id', (req, res) => {
  const session = sessions.find(s => s.id === Number(req.params.id));
  if (!session) return res.status(404).json({ error: "Sesión no encontrada" });
  res.json(session);
});

// ================== GET REPORTS ==================

// Listar informes de un usuario con rango opcional de fechas
app.get('/reports', (req, res) => {
  const { userId, from, to } = req.query;
  let filtered = reports;

  if (userId) filtered = filtered.filter(r => r.userId === Number(userId));
  if (from && to) filtered = filtered.filter(r => r.start >= from && r.end <= to);

  res.json(filtered);
});

// Obtener informe por ID
app.get('/reports/:id', (req, res) => {
  const report = reports.find(r => r.id === Number(req.params.id));
  if (!report) return res.status(404).json({ error: "Informe no encontrado" });
  res.json(report);
});


// Parámetros y Query Strings por recurso
// ================== USERS ==================
// GET /users?limit=10 → listar con límite
app.get('/users', (req, res) => {
  const { limit } = req.query;
  let result = users;

  if (limit) {
    const parsedLimit = Number(limit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      return res.status(400).json({ error: "El parámetro 'limit' debe ser un número positivo" });
    }
    result = users.slice(0, parsedLimit);
  }

  res.json(result);
});

// GET /users/:id → usuario por ID
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  res.json(user);
});

// ================== EXERCISES ==================
// GET /exercises?category=fuerza
app.get('/exercises', (req, res) => {
  const { category } = req.query;
  let result = exercises;

  if (category) {
    result = exercises.filter(e => e.category.toLowerCase() === category.toLowerCase());
    if (result.length === 0) {
      return res.status(404).json({ error: `No se encontraron ejercicios en la categoría '${category}'` });
    }
  }

  res.json(result);
});

// GET /exercises/:id
app.get('/exercises/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const exercise = exercises.find(e => e.id === id);
  if (!exercise) return res.status(404).json({ error: "Ejercicio no encontrado" });

  res.json(exercise);
});

// ================== PLANS ==================
// GET /plans?userId=1
app.get('/plans', (req, res) => {
  const { userId } = req.query;
  let result = plans;

  if (userId) {
    const parsedUserId = Number(userId);
    if (isNaN(parsedUserId)) return res.status(400).json({ error: "El parámetro 'userId' debe ser numérico" });

    result = plans.filter(p => p.userId === parsedUserId);
    if (result.length === 0) {
      return res.status(404).json({ error: `No hay planes para el usuario con ID ${userId}` });
    }
  }

  res.json(result);
});

// GET /plans/:id
app.get('/plans/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const plan = plans.find(p => p.id === id);
  if (!plan) return res.status(404).json({ error: "Plan no encontrado" });

  res.json(plan);
});

// ================== SESSIONS ==================
// GET /sessions?planId=2
app.get('/sessions', (req, res) => {
  const { planId } = req.query;
  let result = sessions;

  if (planId) {
    const parsedPlanId = Number(planId);
    if (isNaN(parsedPlanId)) return res.status(400).json({ error: "El parámetro 'planId' debe ser numérico" });

    result = sessions.filter(s => s.planId === parsedPlanId);
    if (result.length === 0) {
      return res.status(404).json({ error: `No hay sesiones para el plan con ID ${planId}` });
    }
  }

  res.json(result);
});

// GET /sessions/:id
app.get('/sessions/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const session = sessions.find(s => s.id === id);
  if (!session) return res.status(404).json({ error: "Sesión no encontrada" });

  res.json(session);
});

// ================== REPORTS ==================
// GET /reports?userId=1&from=2025-09-01&to=2025-09-15
app.get('/reports', (req, res) => {
  const { userId, from, to } = req.query;
  let result = reports;

  if (userId) {
    const parsedUserId = Number(userId);
    if (isNaN(parsedUserId)) return res.status(400).json({ error: "El parámetro 'userId' debe ser numérico" });

    result = result.filter(r => r.userId === parsedUserId);
  }

  if (from && to) {
    result = result.filter(r => r.start >= from && r.end <= to);
  }

  if (result.length === 0) {
    return res.status(404).json({ error: "No se encontraron informes con esos filtros" });
  }

  res.json(result);
});

// GET /reports/:id
app.get('/reports/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const report = reports.find(r => r.id === id);
  if (!report) return res.status(404).json({ error: "Informe no encontrado" });

  res.json(report);
});

//Request y Response – Manejo de datos de entrada y salida.

// ================================= USERS =================================
// GET /users?limit=2
app.get('/users', (req, res) => {
  const { limit } = req.query;
  let result = users;

  if (limit) {
    const parsed = Number(limit);
    if (isNaN(parsed) || parsed <= 0) {
      return res.status(400).json({ error: "El parámetro 'limit' debe ser un número positivo" });
    }
    result = users.slice(0, parsed);
  }

  res.status(200).json(result);
});

// GET /users/:id
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === Number(id));

  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.status(200).json(user);
});

