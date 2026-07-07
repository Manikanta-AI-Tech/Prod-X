---
name: team-db
description: Shared team coordination database CLI. Use team-db to read/write the shared task board when working on a team.
allowed-tools:
  - bash
---

# team-db — Shared Team Database CLI

`team-db` is the **only** way to access the shared team coordination database. It connects to a local SQLite database synced with Turso, ensuring all team members see the same data.

**NEVER use `sqlite3` or write to the `.db` file directly — only `team-db` triggers sync with Turso.**

## Usage

```bash
team-db <sql>      # Pull, execute, push. Always prints JSON (rows for queries, [] for mutations).
team-db --help     # Show usage
```

Every invocation automatically: pulls latest from Turso, executes your SQL, pushes changes back.

## Database Schema

| Table    | Purpose                                                   |
| -------- | --------------------------------------------------------- |
| `config` | Team configuration (read-only)                            |
| `agents` | Team member roster                                        |
| `tasks`  | Kanban task board (backlog → in-progress → review → done) |

### Tasks columns

| Column        | Description                                     |
| ------------- | ----------------------------------------------- |
| `id`          | Unique task identifier                          |
| `title`       | Short task title                                |
| `description` | What needs to be done                           |
| `status`      | backlog, in-progress, review, or done           |
| `created_by`  | Who created the task                            |
| `assigned_to` | Who is working on it (NULL if unassigned)       |
| `result`      | Summary of completed work (set when completing) |

## Common Patterns

### Check tasks assigned to you

```bash
team-db "SELECT id, title, description FROM tasks WHERE assigned_to = '<your-id>' AND status = 'in-progress'"
```

### Mark a task in progress

```bash
team-db "UPDATE tasks SET status = 'in-progress', updated_at = datetime('now') WHERE id = '<task-id>'"
```

### Complete a task with result

Always write a result — this is how teammates see your output:

```bash
team-db "UPDATE tasks SET status = 'done', result = '<summary of work and findings>', updated_at = datetime('now') WHERE id = '<task-id>'"
```

### Read teammates' completed work

```bash
team-db "SELECT id, title, assigned_to, result FROM tasks WHERE status = 'done'"
```

### Check the full board

```bash
team-db "SELECT id, title, status, assigned_to FROM tasks ORDER BY created_at"
```

## Important

- Every `team-db` call syncs automatically (pull → execute → push).
- **Always write a result** when completing a task. This is the only way teammates can see your work.
- Task assignment is managed by the team lead. Members should not reassign tasks.
