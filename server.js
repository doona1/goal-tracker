require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

// Route to check server status
app.get('/', (req, res) => {
  res.send('Goal Tracker Backend with SQLite Running');
});

// Add a new goal
app.post('/add-goal', (req, res) => {
  const { goal, deadline } = req.body;
  db.run(`INSERT INTO goals (goal, deadline) VALUES (?, ?)`, [goal, deadline], function(err) {
    if (err) {
      return res.status(500).send('Error adding goal');
    }
    res.status(201).send({ id: this.lastID, message: 'Goal added successfully!' });
  });
});

// Add a problem for a specific goal
app.post('/add-problem', (req, res) => {
  const { goal_id, problem } = req.body;
  db.run(`INSERT INTO problems (goal_id, problem) VALUES (?, ?)`, [goal_id, problem], function(err) {
    if (err) {
      return res.status(500).send('Error adding problem');
    }
    res.status(201).send('Problem added successfully!');
  });
});

// Get all goals with their problems
app.get('/goals', (req, res) => {
  db.all(`
    SELECT goals.id, goals.goal, goals.deadline, problems.problem 
    FROM goals LEFT JOIN problems ON goals.id = problems.goal_id
  `, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Error fetching goals');
    }
    res.status(200).json(rows);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
