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


// POST /users → usando req.body
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Faltan datos obligatorios" });

  const newUser = { id: Date.now(), name, email };
  users.push(newUser);

  res.status(201).json({ message: "Usuario creado", user: newUser });
});

// ================================= EXERCISES =================================
// GET /exercises?category=fuerza
app.get('/exercises', (req, res) => {
  const { category } = req.query;
  let result = exercises;

  if (category) {
    result = exercises.filter(e => e.category.toLowerCase() === category.toLowerCase());
  }

  res.status(200).json(result);
});

// GET /exercises/:id
app.get('/exercises/:id', (req, res) => {
  const exercise = exercises.find(e => e.id === Number(req.params.id));
  if (!exercise) return res.status(404).json({ error: "Ejercicio no encontrado" });
  res.status(200).json(exercise);
});

// ================================= PLANS =================================
// GET /plans?userId=1
app.get('/plans', (req, res) => {
  const { userId } = req.query;
  let result = plans;

  if (userId) {
    result = plans.filter(p => p.userId === Number(userId));
    if (result.length === 0) {
      return res.status(404).json({ error: `No hay planes para el usuario con ID ${userId}` });
    }
  }

  res.status(200).json(result);
});

// GET /plans/:id
app.get('/plans/:id', (req, res) => {
  const plan = plans.find(p => p.id === Number(req.params.id));
  if (!plan) return res.status(404).json({ error: "Plan no encontrado" });
  res.status(200).json(plan);
});

// ================================= SESSIONS =================================
// GET /sessions?planId=1
app.get('/sessions', (req, res) => {
  const { planId } = req.query;
  let result = sessions;

  if (planId) {
    result = sessions.filter(s => s.planId === Number(planId));
    if (result.length === 0) {
      return res.status(404).json({ error: `No hay sesiones para el plan con ID ${planId}` });
    }
  }

  res.status(200).json(result);
});

// GET /sessions/:id
app.get('/sessions/:id', (req, res) => {
  const session = sessions.find(s => s.id === Number(req.params.id));
  if (!session) return res.status(404).json({ error: "Sesión no encontrada" });
  res.status(200).json(session);
});

// ================================= REPORTS =================================
// GET /reports?userId=1&from=2025-09-01&to=2025-09-15
app.get('/reports', (req, res) => {
  const { userId, from, to } = req.query;
  let result = reports;

  if (userId) result = result.filter(r => r.userId === Number(userId));
  if (from && to) result = result.filter(r => r.start >= from && r.end <= to);

  if (result.length === 0) {
    return res.status(404).json({ error: "No se encontraron informes con esos filtros" });
  }

  res.status(200).json(result);
});

// GET /reports/:id con verificación por header
app.get('/reports/:id', (req, res) => {
  const apiKey = req.get("X-API-Key");
  if (!apiKey || apiKey !== "12345") {
    return res.status(401).json({ error: "Acceso denegado. API Key inválida" });
  }

  const report = reports.find(r => r.id === Number(req.params.id));
  if (!report) return res.status(404).json({ error: "Informe no encontrado" });

  res.status(200).json(report);
});


//Cabeceras HTTP – Contexto de seguridad y control de datos

// ================== USERS ==================
// GET /users → requiere cabecera Authorization
app.get('/users', (req, res) => {
  const auth = req.get("Authorization");

  if (!auth || auth !== "Bearer secret123") {
    return res.status(401).json({ error: "No autorizado. Falta o es inválido el token" });
  }

  res.set("X-Resource", "Users"); // cabecera de respuesta
  res.status(200).json(users);
});

// ================== EXERCISES ==================
// GET /exercises → cabecera Content-Type debe ser application/json
app.get('/exercises', (req, res) => {
  const contentType = req.get("Content-Type");

  if (contentType && contentType !== "application/json") {
    return res.status(415).json({ error: "Content-Type no soportado. Use application/json" });
  }

  res.set("X-Resource", "Exercises");
  res.status(200).json(exercises);
});

// ================== PLANS ==================
// GET /plans/:id → requiere API Key personalizada
app.get('/plans/:id', (req, res) => {
  const apiKey = req.get("X-API-Key");

  if (!apiKey || apiKey !== "12345") {
    return res.status(403).json({ error: "Acceso denegado. API Key inválida" });
  }

  const plan = plans.find(p => p.id === Number(req.params.id));
  if (!plan) return res.status(404).json({ error: "Plan no encontrado" });

  res.set("X-Checked-By", "WorkoutTrackerAPI");
  res.status(200).json(plan);
});

// ================== SESSIONS ==================
// GET /sessions → requiere Authorization y devuelve cabecera personalizada
app.get('/sessions', (req, res) => {
  const auth = req.get("Authorization");
  if (!auth || !auth.startsWith("Bearer")) {
    return res.status(401).json({ error: "Token requerido en Authorization" });
  }

  res.set("X-Access-Level", "Sessions-ReadOnly");
  res.status(200).json(sessions);
});

// ================== REPORTS ==================
// GET /reports/:id → requiere API Key y Authorization
app.get('/reports/:id', (req, res) => {
  const apiKey = req.get("X-API-Key");
  const auth = req.get("Authorization");

  if (!auth || !auth.startsWith("Bearer")) {
    return res.status(401).json({ error: "No autorizado. Se requiere Bearer token" });
  }

  if (!apiKey || apiKey !== "12345") {
    return res.status(403).json({ error: "Acceso denegado. API Key inválida" });
  }

  const report = reports.find(r => r.id === Number(req.params.id));
  if (!report) return res.status(404).json({ error: "Informe no encontrado" });

  res.set({
    "X-Checked-By": "WorkoutTrackerAPI",
    "X-Security-Level": "High"
  });

  res.status(200).json(report);
});

//Estados HTTP – Comunicación del resultado de operaciones

// ================== USERS ==================
// GET /users/:id
app.get('/users/:id', (req, res) => {
  try {
    const user = users.find(u => u.id === Number(req.params.id));
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor", details: err.message });
  }
});

// POST /users
app.post('/users', (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Faltan datos obligatorios: name y email" });
    }

    const newUser = { id: Date.now(), name, email };
    users.push(newUser);

    res.status(201).json({ message: "Usuario creado", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Error al crear usuario", details: err.message });
  }
});

// ================== EXERCISES ==================
// GET /exercises/:id
app.get('/exercises/:id', (req, res) => {
  try {
    const exercise = exercises.find(e => e.id === Number(req.params.id));
    if (!exercise) return res.status(404).json({ error: "Ejercicio no encontrado" });

    res.status(200).json(exercise);
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor", details: err.message });
  }
});

// ================== PLANS ==================
// GET /plans/:id
app.get('/plans/:id', (req, res) => {
  try {
    const plan = plans.find(p => p.id === Number(req.params.id));
    if (!plan) return res.status(404).json({ error: "Plan no encontrado" });

    res.status(200).json(plan);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener plan", details: err.message });
  }
});

// ================== SESSIONS ==================
// GET /sessions/:id
app.get('/sessions/:id', (req, res) => {
  try {
    const session = sessions.find(s => s.id === Number(req.params.id));
    if (!session) return res.status(404).json({ error: "Sesión no encontrada" });

    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ error: "Error interno", details: err.message });
  }
});

// ================== REPORTS ==================
// GET /reports/:id
app.get('/reports/:id', (req, res) => {
  try {
    const report = reports.find(r => r.id === Number(req.params.id));
    if (!report) return res.status(404).json({ error: "Informe no encontrado" });

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener informe", details: err.message });
  }
});


//Método POST – Creación de recursos//

// ================== USERS ==================
// POST /users
app.post('/users', (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Faltan datos obligatorios: name y email" });
    }

    const newUser = { id: Date.now(), name, email };
    users.push(newUser);

    res.status(201).json({ message: "Usuario creado", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Error al crear usuario", details: err.message });
  }
});

// ================== EXERCISES ==================
// POST /exercises
app.post('/exercises', (req, res) => {
  try {
    const { name, category, muscle } = req.body;

    if (!name || !category || !muscle) {
      return res.status(400).json({ error: "Faltan datos obligatorios: name, category y muscle" });
    }

    const newExercise = { id: Date.now(), name, category, muscle };
    exercises.push(newExercise);

    res.status(201).json({ message: "Ejercicio creado", exercise: newExercise });
  } catch (err) {
    res.status(500).json({ error: "Error al crear ejercicio", details: err.message });
  }
});

// ================== PLANS ==================
// POST /plans
app.post('/plans', (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: "Faltan datos obligatorios: userId y name" });
    }

    const newPlan = { id: Date.now(), userId: Number(userId), name };
    plans.push(newPlan);

    res.status(201).json({ message: "Plan creado", plan: newPlan });
  } catch (err) {
    res.status(500).json({ error: "Error al crear plan", details: err.message });
  }
});

// ================== SESSIONS ==================
// POST /sessions
app.post('/sessions', (req, res) => {
  try {
    const { planId, date, time } = req.body;

    if (!planId || !date || !time) {
      return res.status(400).json({ error: "Faltan datos obligatorios: planId, date y time" });
    }

    const newSession = { id: Date.now(), planId: Number(planId), date, time };
    sessions.push(newSession);

    res.status(201).json({ message: "Sesión creada", session: newSession });
  } catch (err) {
    res.status(500).json({ error: "Error al crear sesión", details: err.message });
  }
});

// ================== REPORTS ==================
// POST /reports
app.post('/reports', (req, res) => {
  try {
    const { userId, start, end, summary } = req.body;

    if (!userId || !start || !end || !summary) {
      return res.status(400).json({ error: "Faltan datos obligatorios: userId, start, end y summary" });
    }

    const newReport = {
      id: Date.now(),
      userId: Number(userId),
      start,
      end,
      summary,
      sessions: 0,
      calories: 0
    };

    reports.push(newReport);

    res.status(201).json({ message: "Informe creado", report: newReport });
  } catch (err) {
    res.status(500).json({ error: "Error al crear informe", details: err.message });
  }
});