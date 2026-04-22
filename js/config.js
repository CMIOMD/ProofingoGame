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

// Default bingo squares (editable in admin) — 9 squares, 3 rows × 3 cols
const DEFAULT_SQUARES = [
  "Nobody Told Us About That",
  "Can It Work Like the Old System?",
  "Exec Sponsor Never Available",
  "Physicians Refused Training",
  "We Thought YOU Were Doing That",
  "Built a Workaround Instead of Fixing It",
  "Go-Live With No Data Cleanup",
  "Champion Quit Week 2",
  "IT Said Yes, Clinical Said No"
];

// ---- Bingo logic (shared) ----------------------------------------

function checkBingo(markedSet) {
  const wins = [];
  for (let r = 0; r < 3; r++) {
    if ([0,1,2].every(c => markedSet.has(r*3+c))) wins.push(`row${r}`);
  }
  for (let c = 0; c < 3; c++) {
    if ([0,1,2].every(r => markedSet.has(r*3+c))) wins.push(`col${c}`);
  }
  if ([0,4,8].every(i => markedSet.has(i))) wins.push('diag0');
  if ([2,4,6].every(i => markedSet.has(i))) wins.push('diag1');
  return wins;
}

function getWinningPositions(wins) {
  const pos = new Set();
  wins.forEach(w => {
    if (w.startsWith('row')) { const r=+w[3]; for(let c=0;c<3;c++) pos.add(r*3+c); }
    if (w.startsWith('col')) { const c=+w[3]; for(let r=0;r<3;r++) pos.add(r*3+c); }
    if (w === 'diag0') [0,4,8].forEach(i => pos.add(i));
    if (w === 'diag1') [2,4,6].forEach(i => pos.add(i));
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
