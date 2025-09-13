
//all tables in one schema file 
import {pgTable, serial, text, timestamp, integer, varchar, json, boolean, date, unique} from "drizzle-orm/pg-core";

// ---------------- USERS ----------------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  profilePhotoUrl: text("profile_photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------------- ORGANIZATIONS ----------------
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------------- ORG MEMBERSHIPS ----------------
export const orgMemberships = pgTable("org_memberships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  orgId: integer("org_id").references(() => organizations.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).default("member"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// ---------------- PHOTOS ----------------
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id, { onDelete: "cascade" }),
  uploaderId: integer("uploader_id").references(() => users.id, { onDelete: "set null" }),
  hangoutId: integer("hangout_id"),
  url: text("url").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const photoTags = pgTable("photo_tags", {
  id: serial("id").primaryKey(),
  photoId: integer("photo_id").references(() => photos.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
});

export const photoLikes = pgTable("photo_likes", {
  id: serial("id").primaryKey(),
  photoId: integer("photo_id").references(() => photos.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const photoComments = pgTable("photo_comments", {
  id: serial("id").primaryKey(),
  photoId: integer("photo_id").references(() => photos.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------------- SURVEYS ----------------
export const surveys = pgTable("surveys", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id, { onDelete: "cascade" }),
  weekStart: date("week_start").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const surveyQuestions = pgTable("survey_questions", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").references(() => surveys.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
});

export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").references(() => surveys.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  questionId: integer("question_id").references(() => surveyQuestions.id, { onDelete: "cascade" }),
  answer: text("answer").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

// ---------------- TASKS ----------------
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
});

// ---------------- PAIRINGS ----------------
export const pairings = pgTable("pairings", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").references(() => surveys.id, { onDelete: "cascade" }),
  user1Id: integer("user1_id").references(() => users.id, { onDelete: "cascade" }),
  user2Id: integer("user2_id").references(() => users.id, { onDelete: "cascade" }),
  taskId: integer("task_id").references(() => tasks.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------------- HANGOUTS ----------------
export const hangouts = pgTable("hangouts", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id, { onDelete: "cascade" }),
  creatorId: integer("creator_id").references(() => users.id, { onDelete: "cascade" }),
  partnerId: integer("partner_id").references(() => users.id),
  taskId: integer("task_id").references(() => tasks.id),
  type: varchar("type", { length: 20 }).notNull(), // 'weekly' or 'extra'
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------------- USER STATS (optional materialized) ----------------
export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  weekStart: date("week_start"),
  photosUploaded: integer("photos_uploaded").default(0),
  hangoutsCompleted: integer("hangouts_completed").default(0),
});
