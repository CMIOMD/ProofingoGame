# Implementation Team Bingo 🎯

Real-time multiplayer bingo. Admin creates a **Group** (a roster of up to 5 players), then launches as many **Games** as they want for that group. Each player gets a personal invite link — shareable via email or text — that always shows the current active game.

---

## Quick Setup (~5 minutes)

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) → create a free account → **New Project**
2. Go to **Settings → API** and copy:
   - **Project URL**
   - **anon public** key

### 2. Set Up the Database
1. In Supabase → **SQL Editor → New Query**
2. Paste and run the entire contents of `supabase-schema.sql`

### 3. Configure the App
1. Open `js/config.js`
2. Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY`

### 4. Run in VS Code
- Install the **Live Server** extension (ritwickdey.LiveServer)
- Right-click `index.html` → **Open with Live Server**

---

## How It Works

### Admin
1. Open the app → **Create Group**
2. Name your group and add up to 5 player names
3. Each player gets a **personal shareable link** — copy it, email it, or text it directly from the app
4. Create a **Game** (fill in 24 bingo squares) and click **Activate**
5. Create more games any time — players' links always show the current active game

### Players
- Click the personal link the admin sends
- Your board loads automatically — no login, no name picking
- Tap squares to mark them — live scoreboard shows everyone's progress
- Full-screen notification when anyone gets BINGO

---

## File Structure

```
BingoBuddy/
├── index.html              ← Home (create or resume a group)
├── admin.html              ← Admin: manage group, players, games
├── game.html               ← Players: personal board + live scoreboard
├── js/
│   └── config.js           ← ⚠️ YOUR SUPABASE CREDENTIALS HERE
├── supabase-schema.sql     ← Run once in Supabase SQL Editor
└── README.md
```

---

## Key Concepts

| Concept | What it is |
|---------|------------|
| **Group** | A roster of up to 5 players who play together |
| **Game** | One bingo round — its own board/squares |
| **Invite Link** | Personal URL per player (`game.html?pid=...`) |
| **Active Game** | The game currently in play; players see it automatically |

Multiple games can exist per group — run as many rounds as you want with the same players.
