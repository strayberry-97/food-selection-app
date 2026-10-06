const { app, BrowserWindow, ipcMain } = require('electron')
const { spawn } = require('child_process')
const path = require('node:path')
const db = require('./database')
const projectRoot = path.join(__dirname, '..', '..')
const pagesPath = path.join(__dirname, '..', 'renderer', 'pages')

require('electron-reload')(projectRoot);

function runPython(meals, history) {
    const python = spawn('python3', [
        '././recommendation_engine/recommender.py'
    ]);

    python.stdin.write(JSON.stringify({meals: meals, history: history}));
    python.stdin.end();

    python.stdout.on('data', (data) => {
        console.log(`Python stdout: ${data}`);
    });

    python.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
    });

    python.on('error', (error) => {
        console.error('Failed to start Python:', error);
    });

    python.on('close', (code) => {
        console.log(`Python exited with code ${code}`);
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

function handleGetRecommendation(){
  const meals = handleGetMeals();
  const history = handleRetrieveMealHistory();

  const result = runPython(meals, history);

  return result;
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

function handleRetrieveMealHistory(){
  const query = db.prepare(`
        SELECT history_id,
               meal_id,
               eaten_at,
               user_rating
        FROM meal_history
        ORDER BY eaten_at DESC;
    `);

  return query.all();
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

  win.loadFile(path.join(pagesPath, 'result.html'))
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

app.whenReady().then(() => {

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})