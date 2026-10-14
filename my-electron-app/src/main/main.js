const { app, BrowserWindow, ipcMain } = require('electron')
const { spawn } = require('child_process')
const path = require('node:path')
const db = require('./database')
const projectRoot = path.join(__dirname, '..', '..')
const pagesPath = path.join(__dirname, '..', 'renderer', 'pages')
const preferencesPath = path.join(app.getPath('userData'), 'prefs.json')
const fs = require('fs');

require('electron-reload')(projectRoot);

function runPython(meals, history, declined) {
  return new Promise((resolve, reject) => {
    const python = spawn('python3', [
        '././recommendation_engine/recommender.py'
    ]);

    python.stdin.write(JSON.stringify({meals: meals, history: history, declined: declined}));
    python.stdin.end();

    let output = '';

    python.stdout.on('data', (data) => {
        output += data.toString();
    });

    python.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
    });

     python.on('error', (error) => {
        reject(error);
    });

    python.on('close', (code) => {
        if (code === 0){
          resolve(output);
        } else {
          reject( new Error (`Python exited with code ${code}`))
        }
    });

  });
}

function handleAddHistory(mealId, rating = null) {
    const query = db.prepare(`
        INSERT INTO meal_history (meal_id, eaten_at, user_rating)
        VALUES (?, ?, ?)
    `);

    return query.run(
        mealId,
        new Date().toISOString(),
        rating
    );
}

async function handleGetRecommendation(){
  const meals = handleGetMeals();
  const history = handleRetrieveMealHistory();
  const declined = handleDeclinedHistory();

  const result = await runPython(meals, history, declined);

  const recommendation = JSON.parse(result);

  return recommendation;
}

function handleGetMeals(){
  const query = db.prepare(`SELECT
                                m.*,
                                r.name AS restaurant_name,
                                r.cuisine,
                                r.rating,
                                r.delivery_time_min,
                                GROUP_CONCAT(t.name) AS tags
                            FROM meals m
                            JOIN restaurants r
                                ON m.restaurant_id = r.restaurant_id
                            LEFT JOIN meal_tags mt
                                ON m.meal_id = mt.meal_id
                            LEFT JOIN tags t
                                ON mt.tag_id = t.tag_id
                            GROUP BY m.meal_id;
           `);

  return query.all();
}

function handleDecline(mealId, reason){
  const query = db.prepare(`
        INSERT INTO declined_meals (meal_id, declined_at, reason)
        VALUES (?, ?, ?)
    `);

  return query.run(    
    mealId,
    new Date().toISOString(),
    reason
  );
}

function handleRetrieveMealHistory(){
  const query = db.prepare(`
    SELECT
        h.history_id,
        h.meal_id,
        h.eaten_at,
        h.user_rating,
        m.name AS meal_name,
        r.name AS restaurant_name
    FROM meal_history h
    JOIN meals m
        ON h.meal_id = m.meal_id
    JOIN restaurants r
        ON m.restaurant_id = r.restaurant_id
    ORDER BY h.eaten_at DESC;
  `);

  return query.all();
}

function handleDeclinedHistory(){
  const query = db.prepare(`
      SELECT 
        d.decline_id,
        d.meal_id,
        d.declined_at,
        d.reason
      FROM declined_meals d
      ORDER BY d.declined_at DESC;
    `);

    return query.all();
}

function handleUpdateRating(historyId, rating){
  const query = db.prepare(`
        UPDATE meal_history
        SET user_rating = ?
        WHERE history_id = ?
    `);

  return query.run(rating, historyId);
}

function handleGetCuisines(){
  const query = db.prepare(`
        SELECT DISTINCT cuisine
        FROM restaurants
        WHERE cuisine IS NOT NULL
        ORDER BY cuisine
    `);

  return query.all();
}

function handleGetRestaurants(){
  const query = db.prepare(`
        SELECT name
        FROM restaurants
    `);
  return query.all();
}

function handleGetTags(){
  const query = db.prepare(`
        SELECT name
        FROM tags
    `);
  return query.all();
}

function handleSavePreferences(preferences){
  fs.writeFileSync(
    preferencesPath,
    JSON.stringify(preferences, null, 2),
    'utf8'
  );
  return {success : true};
}

function handleLoadPreferences(){
  if(!fs.existsSync(preferencesPath)){
    return null;
  }
  const json = fs.readFileSync(
    preferencesPath,
    'utf8'
  )
  return JSON.parse(json)
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 673,
    height: 408,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true
    }
  })

  win.loadFile(path.join(pagesPath, 'index.html'))
}

ipcMain.on('minimize-window', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize()
})

ipcMain.on('close-window', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close()
})

ipcMain.handle('database:getMeals', handleGetMeals)

ipcMain.handle('recommender:getRecommendation', handleGetRecommendation)

ipcMain.handle('history:add', (event, mealId, rating) => {
  handleAddHistory(mealId, rating);
})

ipcMain.handle('history:retrieve', handleRetrieveMealHistory)

ipcMain.handle('history:decline', (event, mealId, reason) =>{
  handleDecline(mealId, reason);
} )

ipcMain.handle('history:updateRating', (event, historyId, rating) =>{
  return handleUpdateRating(historyId, rating);
});

ipcMain.handle('database:savePreferences', (event, preferences) =>{
  return handleSavePreferences(preferences);
})

ipcMain.handle('database:loadPreferences', handleLoadPreferences);

ipcMain.handle('history:declinedHistory', handleDeclinedHistory);

ipcMain.handle('database:getCuisines', handleGetCuisines);

ipcMain.handle('database:getRestaurants', handleGetRestaurants);

ipcMain.handle('database:getTags', handleGetTags);

app.whenReady().then(() => {

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})