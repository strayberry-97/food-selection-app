const db = require('../src/main/database');
const fs = require('fs');
const path = require('node:path');
const { parse } = require("csv-parse/sync");

db.exec(`
    DELETE FROM meal_tags;
    DELETE FROM tags;
    DELETE FROM meals;
    DELETE FROM restaurants;

    DELETE FROM sqlite_sequence
    WHERE name = 'tags';
`);


const importsPath = path.join(__dirname, '..', 'data', 'imports');
const restaurantsCSV = fs.readFileSync(path.join(importsPath, 'Restaurants.csv'), "utf8");
const mealsCSV = fs.readFileSync(path.join(importsPath, 'Meals_processed.csv'), "utf8");

const restaurantsData = parse(restaurantsCSV, {
    columns: true,
    skip_empty_lines: true
});

const mealsData = parse(mealsCSV, {
    columns: true,
    skip_empty_lines: true
});


const insertRestaurant = db.prepare(`
        INSERT INTO restaurants (
            restaurant_id,
            name,
            cuisine,
            rating,
            delivery_time_min
        )
        VALUES (?, ?, ?, ?, ?)
    `);

const insertMeal = db.prepare(`
    INSERT INTO meals (
        meal_id,
        restaurant_id,
        name,
        description,
        price,
        category
    )
    VALUES (?, ?, ?, ?, ?, ?)
`);

const insertTag = db.prepare(`
    INSERT OR IGNORE INTO tags (name)
    VALUES (?)
`);

const getTag = db.prepare(`
    SELECT tag_id
    FROM tags
    WHERE name = ?
`);

const insertMealTag = db.prepare(`
    INSERT OR IGNORE INTO meal_tags (meal_id, tag_id)
    VALUES (?, ?)
`);

const tagColumns = Object.keys(mealsData[0]).filter(column =>
    ![
        "meal_id",
        "restaurant_id",
        "name",
        "description",
        "price",
        "category"
    ].includes(column)
);

 for (const restaurant of restaurantsData) {
     insertRestaurant.run(
         Number(restaurant.restaurant_id),
         restaurant.name,
         restaurant.cuisine,
         Number(restaurant.rating),
         Number(restaurant.delivery_time_min)
     );
 }

 for (const meal of mealsData) {
     insertMeal.run(
         Number(meal.meal_id),
         Number(meal.restaurant_id),
         meal.name,
         meal.description,
         Number(meal.price),
         meal.category
     );
 }

 for (const tag of tagColumns) {
    insertTag.run(tag);
}

for (const meal of mealsData) {
    for (const tag of tagColumns) {
        if (Number(meal[tag]) === 1) {

            const tagRow = getTag.get(tag);

            insertMealTag.run(
                Number(meal.meal_id),
                tagRow.tag_id
            );
        }
    }
}
 