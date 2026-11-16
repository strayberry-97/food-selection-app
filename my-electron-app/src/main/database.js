const { app } = require('electron');
const Database = require('better-sqlite3');
const path = require('node:path');
const fs = require('node:fs');

const sourcePath = app.isPackaged
    ? path.join(process.resourcesPath, 'data', 'meals.db')
    : path.join(__dirname, '..', '..', 'data', 'meals.db');

let dbPath = sourcePath;

if (app.isPackaged) {
    dbPath = path.join(app.getPath('userData'), 'meals.db');

    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(path.dirname(dbPath), { recursive: true });
        fs.copyFileSync(sourcePath, dbPath);
    }
}

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");



db.exec(`
    CREATE TABLE IF NOT EXISTS restaurants (
        restaurant_id INTEGER PRIMARY KEY,
        source TEXT NOT NULL,
        source_id TEXT,
        name TEXT NOT NULL,
        cuisine TEXT,
        rating REAL,
        delivery_time_min INTEGER
    );

    CREATE TABLE IF NOT EXISTS meals (
        meal_id INTEGER PRIMARY KEY,
        restaurant_id INTEGER NOT NULL,
        source TEXT NOT NULL,
        source_id TEXT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL,
        category TEXT,

        FOREIGN KEY (restaurant_id)
            REFERENCES restaurants(restaurant_id)
    );

    CREATE TABLE IF NOT EXISTS tags (
        tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS meal_tags (
        meal_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,

        PRIMARY KEY (meal_id, tag_id),

        FOREIGN KEY (meal_id)
            REFERENCES meals(meal_id),

        FOREIGN KEY (tag_id)
            REFERENCES tags(tag_id)
    );

    CREATE TABLE IF NOT EXISTS meal_history (
        history_id INTEGER PRIMARY KEY AUTOINCREMENT,
        meal_id INTEGER NOT NULL,
        eaten_at TEXT NOT NULL,
        user_rating INTEGER,

        FOREIGN KEY (meal_id)
            REFERENCES meals(meal_id)
    );

    CREATE TABLE IF NOT EXISTS declined_meals (
    decline_id INTEGER PRIMARY KEY AUTOINCREMENT,
    meal_id INTEGER NOT NULL,
    declined_at TEXT NOT NULL,
    reason TEXT,
    FOREIGN KEY (meal_id) REFERENCES meals(meal_id)
);
`);



module.exports = db;