// Fetch and display all goals with their problems
async function fetchGoals() {
    const response = await fetch('/goals');
    const data = await response.json();
  
    const goalsList = document.getElementById('goals-list');
    goalsList.innerHTML = '';
  
    const groupedGoals = {};
  
    // Group problems under their respective goals
    data.forEach(item => {
      if (!groupedGoals[item.id]) {
        groupedGoals[item.id] = {
          goal: item.goal,
          deadline: item.deadline,
          problems: []
        };
      }
      if (item.problem) groupedGoals[item.id].problems.push(item.problem);
    });
  
    // Display goals and their problems
    for (const id in groupedGoals) {
      const goal = groupedGoals[id];
      const goalCard = document.createElement('div');
      goalCard.className = 'goal-card';
      goalCard.innerHTML = `
        <h3>${goal.goal} - <small>Deadline: ${goal.deadline}</small></h3>
        <div class="problem-list">
          ${goal.problems.map(problem => `<p>• ${problem}</p>`).join('')}
          <input type="text" placeholder="Add problem" id="problem-${id}">
          <button onclick="addProblem(${id})">Add Problem</button>
        </div>
      `;
      goalsList.appendChild(goalCard);
    }
  }
  
  // Add a new goal
  async function addGoal() {
    const goal = document.getElementById('goal').value;
    const deadline = document.getElementById('deadline').value;
  
    if (!goal || !deadline) {
      alert('Please enter both goal and deadline.');
      return;
    }
  
    await fetch('/add-goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, deadline })
    });
  
    document.getElementById('goal').value = '';
    document.getElementById('deadline').value = '';
    fetchGoals();
  }
  
  // Add a problem to a specific goal
  async function addProblem(goalId) {
    const problemInput = document.getElementById(`problem-${goalId}`);
    const problem = problemInput.value;
  
    if (!problem) {
      alert('Please enter a problem.');
      return;
    }
  
    await fetch('/add-problem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal_id: goalId, problem })
    });
  
    problemInput.value = '';
    fetchGoals();
  }
  
  // Load goals on page load
  fetchGoals();
  