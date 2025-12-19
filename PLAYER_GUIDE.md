# Player Guide: Fantasy Team Management Game

Welcome to the Fantasy Team Management Game! This guide will help you understand how to play and succeed in the game.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Teams](#teams)
3. [Team Currency (Cash)](#team-currency-cash)
4. [Players](#players)
5. [The Leaderboard](#the-leaderboard)
6. [Task List](#task-list)
7. [Logs](#logs)
8. [Seasons](#seasons)
9. [Strategies & Tips](#strategies--tips)

---

## Getting Started

After signing up and logging in, you'll be taken to your **Team Dashboard** (Home page). This is your command center where you can:
- View your team's current status
- See your players and their positions
- Monitor your cash balance and points
- Navigate to other sections of the game

---

## Teams

### What is a Team?
Your team is your identity in the game. Each team has:
- **Name**: Your team's unique identifier
- **Cash**: Your team's currency (starts at $950,000)
- **Total Points (TTP)**: Lifetime points earned
- **Weekly Points (WP)**: Points earned in the current week
- **Leaderboard Score**: Your ranking score (see [The Leaderboard](#the-leaderboard))

### Team Dashboard
The dashboard shows:
- Your team name, total points, weekly points, and cash balance
- Your 5 player positions (3 office + 2 warehouse)
- Quick navigation to Leaderboard, Player List, Task List, and Logs

### Team Positions
Your team must fill 5 positions:
- **Office Positions** (3):
  - **CS**: Customer Service
  - **CC**: Customer Care
  - **PR**: Public Relations
- **Warehouse Positions** (2):
  - **PI**: Pick & Inventory
  - **PA**: Pack & Assembly

---

## Team Currency (Cash)

### Starting Cash
Every team starts with **$950,000** in cash.

### Earning Cash
- **Task Completion**: Earn **$1,000** for each task you complete
- **Selling Players**: Receive the player's current market value when you sell them (after cooldown period)
- **Season Rewards**: Winning teams receive cash rewards at the end of seasons

### Spending Cash
- **Buying Players**: Players cost their current salary (market value)
- **Dispute Penalties**: If 3+ teams dispute your task completion, you lose **$15,000**

### Cash Management Tips
- Keep some cash in reserve for opportunities
- Monitor player prices - they increase with demand
- Consider selling players after they've improved to maximize profit

---

## Players

### Understanding Players
Players are the core of your team. Each player has:

#### Attributes (0-99 scale)
- **Attendance**: How consistently the player shows up
- **Social**: Player's teamwork and communication skills
- **Productivity**: How efficiently the player works
- **Intensity**: Player's work pace and energy
- **Specialty Rating**: Expertise in their specialty area

#### Overall Rating
Calculated as the average of all 5 attributes, capped at 99:
```
Overall Rating = (Attendance + Social + Productivity + Intensity + Specialty Rating) / 5
```

#### Player Information
- **Name**: The player's identifier
- **Role**: Office or Warehouse role
- **Specialty**: Specialized skill area (e.g., "Finer Details", "Operational Backbone", "Digital Expert", "Forklift Certified", "Warehouse Warrior", "Product Knowledge")
- **Salary**: Current market value (what you pay to buy them)

### Buying Players

1. Navigate to **Player List** from the main menu
2. Browse available players
3. Click **BUY** on a player you want
4. Select a **Position** (CS, CC, PR, PI, or PA)
5. Confirm the purchase

**Important Rules:**
- You can only have **5 players maximum** (one per position)
- You must have enough cash to cover the player's salary
- Each player can only be on one team at a time
- Player prices increase by $10,000 each time they're purchased

### Player Salary Calculation
Player salaries are dynamic and calculated as:
- **Base Salary**: $100,000 + $10,000 per previous purchase
- **Demand Bonus**: +$10,000 per team that owns the player
- **Performance Bonus**: +$5,000 per 3 points of overall rating increase from baseline

### Selling Players

1. Go to your **Team Dashboard**
2. Find the player you want to sell
3. Click the **SELL** button (or see cooldown timer)
4. Confirm the sale

**Important Rules:**
- **6-Week Cooldown**: You cannot sell a player until 6 weeks (42 days) after purchase
- **Sale Price**: You receive the player's current market value (not what you paid)
- **Profit/Loss**: The difference between sale price and purchase price is your profit/loss

### Player Development

Players improve through task completion:

#### Attribute Points System
- Players earn **attribute points** for completing tasks (points accumulate, then convert to attributes)
- **25 attribute points** = +1 to that attribute (attendance, social, productivity, intensity)
- **10 specialist points** = +1 to specialty rating
- Attributes are capped at 99
- Points accumulate in the background and automatically convert to attribute increases when thresholds are reached

#### How Players Earn Points
- **Task Assignment**: Assign players to specific task items
- **Attribute Matching**: Players earn bonus points when task items match their attributes
- **Specialty Matching**: Players earn bonus points when task items match their specialty
- **Task Productivity Bonus**: All assigned players get a task-wide productivity bonus (varies by task, typically 2-3 points)

#### Automatic Bonuses

**Per-Task Bonuses:**
- **Attendance Bonus**: +2 attendance_points for each player assigned to a task (awarded automatically when task is completed)
- **Task Productivity Bonus**: All assigned players receive a task-specific productivity bonus (shown in task details, typically 2-3 points)
- **Category-Specific Intensity Bonus**: 
  - **Office Tasks**: +1 intensity_points to Office role players (CS, CC, PR) assigned to the task
  - **Warehouse Tasks**: +1 intensity_points to Warehouse role players (PI, PA) assigned to the task

**Daily Bonuses:**
- **Productivity Bonus**: +2 productivity_points if a player is used in 2+ tasks in one day
- **Intensity Bonus**: +0.02 intensity if a player is used in 5+ tasks in one day

**Task-Specific Bonuses:**
- **Social Bonus**: +0.01 social if a player is used 4+ times in a "customer service" or "collaborative" task
- **Specialist Bonus**: +0.02 specialist if a task tag matches the player's specialty

---

## The Leaderboard

### What is the Leaderboard?
The leaderboard ranks all teams by their **Leaderboard Score**. This is your primary competitive metric.

### Leaderboard Score Formula
```
Leaderboard Score = (Average Overall Rating × 100) + (Budget Remaining / 1000) + (Total Team Points / 10)
```

**Breaking it down:**
- **Average Overall Rating × 100**: Your team's average player rating, multiplied by 100
- **Budget Remaining / 1000**: Your remaining cash divided by 1000
- **Total Team Points / 10**: Your lifetime points divided by 10

### Leaderboard Display
The leaderboard shows:
- **Rank**: Your position (1st, 2nd, 3rd, etc.)
- **Team Name**: Click to view team details
- **Weekly Points**: Points earned this week
- **Total Points**: Lifetime points
- **Avg Team Rating**: Average overall rating of your players
- **Leaderboard Score**: Your calculated ranking score

### Strategy
- **Balance is key**: High-rated players + cash reserves + task completion
- **Don't spend all cash**: Budget remaining contributes to your score
- **Complete tasks regularly**: Points are a significant component
- **Develop players**: Higher ratings = higher scores

---

## Task List

### What are Tasks?
Tasks are work items that your team can complete to earn:
- **Team Points**: Added to your total and weekly points
- **Cash**: $1,000 per completed task
- **Player Attribute Points**: Players assigned to tasks earn attribute points

### Available Tasks
Navigate to **Task List** to see all available tasks. Examples include:
- "Add a product to the store" (Office task)
- "Receive a shipment" (Warehouse task)
- More tasks may be added over time

### Task Categories
Tasks are categorized into two types:
- **Office Tasks**: Tasks that require office work (e.g., product management, customer service)
- **Warehouse Tasks**: Tasks that require warehouse work (e.g., receiving shipments, inventory management)

**Why Categories Matter:**
- Office role players (CS, CC, PR) earn +1 intensity_points when assigned to Office tasks
- Warehouse role players (PI, PA) earn +1 intensity_points when assigned to Warehouse tasks
- Match your players to tasks that suit their roles for maximum bonuses!

### Completing a Task

1. **Select a Task**: Click on a task from the Task List
2. **Review Checklist**: Each task has a checklist of items
3. **Check Off Items**: Mark items as complete as you finish them
4. **Assign Players** (Optional): Assign players to specific items for attribute points
5. **Delegate Items** (Optional): Delegate items to other teams
6. **Submit**: Click "Submit Task" when done

### Task Item Types

Each checklist item shows:
- **Description**: What needs to be done
- **Team Points**: Points your team earns (shown in green)
- **Attribute Points** (if applicable): Points players earn for matching attributes
- **Specialty Points** (if applicable): Points players earn for matching specialties

### Player Assignment

- **Assign Players**: Click "Assign Player" on any item to assign one of your players
- **Why Assign?**: Assigned players earn:
  - Attribute and specialty points from item completion
  - Task productivity bonus (shown in task details)
  - Attendance bonus (+2 attendance_points)
  - Category-specific intensity bonus if role matches task category
- **Multiple Assignments**: Players can be assigned to multiple items
- **Role Matching**: Assign Office players (CS, CC, PR) to Office tasks and Warehouse players (PI, PA) to Warehouse tasks for bonus intensity points

### Task Delegation

- **Delegate Items**: Click "Delegate" to assign an item to another team
- **Why Delegate?**: Share work with other teams (they get the points)
- **When to Delegate**: If you're busy, or if another team specializes in that work
- **Points**: Delegated items award points to the delegated team, not yours

### Task Submission

- **Points Calculation**: Only checked items count toward points
- **Multiple Teams**: If you delegate items, multiple teams may receive points
- **Cash Reward**: $1,000 automatically added to your cash
- **Player Points**: All bonuses are automatically awarded to assigned players:
  - Attribute points from item completion
  - Task productivity bonus
  - Attendance bonus (+2 points)
  - Category-specific intensity bonus (if role matches)

---

## Logs

### What are Logs?
The **Logs** page shows a history of all completed tasks across all teams.

### Log Information
Each log entry shows:
- **Task Name**: What task was completed
- **Team Name**: Which team completed it (clickable to view team)
- **Points Awarded**: How many points the team earned
- **Completed At**: When the task was completed
- **Delegations**: If items were delegated to other teams
- **Disputes**: If other teams disputed the completion

### Disputing Task Completions

If you believe a task was completed incorrectly:

1. Go to the **Logs** page
2. Find the task completion you want to dispute
3. Click the **Dispute** button
4. Confirm your dispute

**Dispute Rules:**
- You cannot dispute your own task completions
- You can only dispute each completion once
- If **3 or more teams** dispute a completion, penalties are applied:
  - **$15,000 fine** to the completing team
  - **50 points deducted** from the completing team
- Once penalties are applied, the dispute is resolved and cannot be disputed again

### Why Check Logs?
- **Monitor Competition**: See what other teams are doing
- **Learn from Others**: See how tasks are being completed
- **Quality Control**: Dispute incorrect completions
- **Track Activity**: Understand game activity patterns

---

## Seasons

### What are Seasons?
Seasons are competitive periods with a start and end date. At the end of each season:
- The team with the highest **Leaderboard Score** wins
- Winners receive cash and point rewards
- A new season begins

### Season Information
- **Season Number**: Each season is numbered sequentially
- **Start Date**: When the season begins
- **End Date**: When the season ends
- **Status**: Active, Pending, or Completed

### Season Countdown
The leaderboard shows a countdown timer for the current season, showing:
- Days, hours, minutes, and seconds remaining

### Season Rewards
Winning teams receive:
- **Cash Reward**: Typically $50,000 (may vary)
- **Points Reward**: Typically 1,000 points (may vary)

### Hall of Fame
Completed seasons are recorded in the **Hall of Fame**, showing:
- Season winners
- Top 3 teams for each season
- Final scores

---

## Strategies & Tips

### Building Your Team

1. **Start with Balanced Players**: Don't just buy the highest-rated players
2. **Consider Specialties**: Match player specialties to tasks you plan to complete
3. **Balance Office and Warehouse**: Have both Office (CS, CC, PR) and Warehouse (PI, PA) players to handle all task types
4. **Budget Wisely**: Keep cash reserves for opportunities
5. **Develop Players**: Assign players to tasks to improve their attributes

### Managing Cash

1. **Don't Spend Everything**: Budget remaining contributes to leaderboard score
2. **Buy Low, Sell High**: Purchase players when prices are reasonable
3. **Complete Tasks**: Regular task completion provides steady cash flow
4. **Plan for Cooldowns**: Remember the 6-week cooldown when selling players

### Maximizing Points

1. **Complete Tasks Regularly**: Consistent task completion builds points
2. **Assign Players**: Always assign players to tasks for attribute points
3. **Match Specialties**: Assign players to tasks that match their specialties
4. **Avoid Disputes**: Complete tasks correctly to avoid penalties

### Leaderboard Strategy

1. **Balance All Components**: 
   - High player ratings
   - Cash reserves
   - Task completion points
2. **Monitor Competition**: Check the leaderboard regularly
3. **Time Your Moves**: Make strategic purchases and sales
4. **Develop Players**: Improved players = higher ratings = higher scores

### Task Completion Tips

1. **Read Carefully**: Understand what each task item requires
2. **Assign Strategically**: 
   - Match players to items that suit their attributes/specialties
   - Assign Office players to Office tasks and Warehouse players to Warehouse tasks for category bonuses
3. **Always Assign Players**: Every assigned player gets attendance bonus and task productivity bonus
4. **Delegate When Needed**: Don't be afraid to delegate items to other teams
5. **Quality Over Speed**: Complete tasks correctly to avoid disputes

### Player Development

1. **Regular Assignment**: Assign players to tasks frequently - every assignment gives attendance bonus
2. **Specialty Matching**: Match player specialties to task requirements
3. **Role Matching**: Assign players to tasks matching their role (Office/Warehouse) for intensity bonuses
4. **Multiple Tasks**: Use players in multiple tasks per day for productivity and intensity bonuses
5. **Patience**: Player development takes time - be patient

### Avoiding Penalties

1. **Complete Tasks Correctly**: Follow task requirements carefully
2. **Don't Rush**: Take time to ensure quality
3. **Review Before Submitting**: Double-check your work
4. **Respond to Disputes**: If disputed, review and learn from mistakes

---

## Quick Reference

### Key Metrics
- **Leaderboard Score** = (Avg Rating × 100) + (Cash / 1000) + (Points / 10)
- **Player Overall Rating** = Average of 5 attributes (capped at 99)
- **Player Salary** = Base ($100k + $10k per purchase) + Demand + Performance

### Important Numbers
- Starting Cash: **$950,000**
- Max Players: **5** (one per position)
- Sell Cooldown: **42 days (6 weeks)**
- Task Cash Reward: **$1,000**
- Dispute Penalty: **$15,000 + 50 points** (if 3+ disputes)
- Attribute Conversion: **25 points = +1 attribute**
- Specialty Conversion: **10 points = +1 specialty rating**

### Automatic Bonus Values
- **Attendance Bonus**: +2 attendance_points per task (for assigned players)
- **Task Productivity Bonus**: Varies by task (typically 2-3 points)
- **Category Intensity Bonus**: +1 intensity_points (Office players in Office tasks, Warehouse players in Warehouse tasks)
- **Daily Productivity Bonus**: +2 productivity_points (if player used in 2+ tasks/day)
- **Daily Intensity Bonus**: +0.02 intensity (if player used in 5+ tasks/day)
- **Social Bonus**: +0.01 social (if player used 4+ times in social task)
- **Specialist Bonus**: +0.02 specialist (if task tag matches specialty)

### Navigation
- **Home**: Team Dashboard
- **Leaderboard**: See all teams ranked
- **Player List**: Browse and buy players
- **Task List**: View and complete tasks
- **Logs**: View task completion history
- **Hall of Fame**: See season winners

---

## Need Help?

If you have questions or need assistance:
- Check this guide first
- Review the in-game tooltips
- Monitor the Logs to see how others play
- Experiment and learn from experience

**Good luck, and may the best team win!**

