import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import * as schema from "./db/schema.js";
import { eq } from "drizzle-orm";

const app = express();
const PORT = ENV.PORT || 5001; 

app.use(express.json());

// ----------------------
// Health Check
// ----------------------
app.get("/api/health", (req, res) => {
  console.log("Hit /api/health ✅");
  res.status(200).json({ success: true });
});

// ----------------------
// USERS ENDPOINTS
// ----------------------

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await db.select().from(schema.users);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Create a user
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, surveyResponses } = req.body;
    const [user] = await db
      .insert(schema.users)
      .values({ name, email, surveyResponses })
      .returning();
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error); 
    res.status(500).json({ error: error.message }); 
  }
});
 

// Get one user
app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, Number(id)));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ----------------------
// TASKS ENDPOINTS
// ----------------------
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await db.select().from(schema.tasks);
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { task, tags } = req.body;
    const [newTask] = await db
      .insert(schema.tasks)
      .values({ task, tags })
      .returning();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// ----------------------
// PAIRINGS ENDPOINTS
// ----------------------
app.get("/api/pairings", async (req, res) => {
  try {
    const pairings = await db.select().from(schema.pairings);
    res.json(pairings);
  } catch (error) {
    console.error("Error fetching pairings:", error);
    res.status(500).json({ error: "Failed to fetch pairings" });
  }
});

app.post("/api/pairings", async (req, res) => {
  try {
    const { weekId, user1, user2, taskId, photoUrl } = req.body;
    const [pairing] = await db
      .insert(schema.pairings)
      .values({ weekId, user1, user2, taskId, photoUrl })
      .returning();
    res.status(201).json(pairing);
  } catch (error) {
    console.error("Error creating pairing:", error);
    res.status(500).json({ error: "Failed to create pairing" });
  }
});

// ----------------------
// Server Start
// ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
