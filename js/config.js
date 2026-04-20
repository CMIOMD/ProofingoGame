// ================================================================
// EDIT THIS FILE — add your Supabase credentials
// Supabase Dashboard → Settings → API
// ================================================================

const SUPABASE_URL      = 'https://jjoumtmhdukbhwydpofz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqb3VtdG1oZHVrYmh3eWRwb2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTUyMjAsImV4cCI6MjA5MjI3MTIyMH0.1b47nlt3qGrgNQ7LpLoa04GCYqJpcBoL_GC1q6yWdy0';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Player colour palette (slot 0–4)
const PLAYER_COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#f9ca24'];

// Default bingo squares (editable in admin) — 20 squares, 5 rows × 4 cols
const DEFAULT_SQUARES = [
  "Nobody Told Us About That",
  "Super Users All Left After Go-Live",
  "Can It Work Like the Old System?",
  "Skipped Every UAT Session",
  "Exec Sponsor Never Available",
  "We Want to Go Back to Paper",
  "Physicians Refused Training",
  "Discovery Questionnaire: Blank",
  "We Thought YOU Were Doing That",
  "Steering Committee Ghosted Us",
  "Built a Workaround Instead of Fixing It",
  "That's Not How WE Do It Here",
  "Go-Live With No Data Cleanup",
  "Nobody Read the Release Notes",
  "Champion Quit Week 2",
  "We Need It Custom Built",
  "Optimization Review Cancelled Again",
  "IT Said Yes, Clinical Said No",
  "We Didn't Know That Feature Existed",
  "Pre-Work Not Done By Go-Live"
];

// ---- Bingo logic (shared) ----------------------------------------

function checkBingo(markedSet) {
  const wins = [];
  for (let r = 0; r < 5; r++) {
    if ([0,1,2,3].every(c => markedSet.has(r*4+c))) wins.push(`row${r}`);
  }
  for (let c = 0; c < 4; c++) {
    if ([0,1,2,3,4].every(r => markedSet.has(r*4+c))) wins.push(`col${c}`);
  }
  return wins;
}

function getWinningPositions(wins) {
  const pos = new Set();
  wins.forEach(w => {
    if (w.startsWith('row')) { const r=+w[3]; for(let c=0;c<4;c++) pos.add(r*4+c); }
    if (w.startsWith('col')) { const c=+w[3]; for(let r=0;r<5;r++) pos.add(r*4+c); }
  });
  return pos;
}

function hasBingo(markedSet) {
  return checkBingo(markedSet).length > 0;
}

// Build the base game URL (works on any host)
function baseUrl() {
  return `${location.origin}${location.pathname.replace(/[^/]*$/, '')}`;
}

function playerInviteUrl(playerId) {
  return `${baseUrl()}game.html?pid=${playerId}`;
}

function adminGroupUrl(groupId) {
  return `${baseUrl()}admin.html?gid=${groupId}`;
}
