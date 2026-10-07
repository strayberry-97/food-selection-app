const Database = require("better-sqlite3");
const path = require("node:path");

const db = new Database(path.join(__dirname, "..", "..", "data", "meals.db"));


db.pragma("foreign_keys = ON");



db.exec(`
    CREATE TABLE IF NOT EXISTS restaurants (
        restaurant_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        cuisine TEXT,
        rating REAL,
        delivery_time_min INTEGER
    );

    CREATE TABLE IF NOT EXISTS meals (
        meal_id INTEGER PRIMARY KEY,
        restaurant_id INTEGER NOT NULL,
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