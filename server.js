const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const history = require('connect-history-api-fallback');
const app = express();
const { readPrompts, writePrompts } = require('./database');
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// API routes are defined before the history fallback and static serving
// --- API Routes for Prompts ---

// GET all prompts
app.get('/api/prompts', async (req, res) => {
  try {
    const prompts = await readPrompts();
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prompts", error: error.message });
  }
});

// POST a new prompt
app.post('/api/prompts', async (req, res) => {
  try {
    const prompts = await readPrompts();
    const newPrompt = {
      id: `prompt-${crypto.randomBytes(8).toString('hex')}`, // Generate a random ID
      ...req.body
    };
    prompts.push(newPrompt);
    await writePrompts(prompts);
    res.status(201).json(newPrompt);
  } catch (error) {
    res.status(500).json({ message: "Error creating prompt", error: error.message });
  }
});

// PUT (update) an existing prompt
app.put('/api/prompts/:id', async (req, res) => {
  try {
    const prompts = await readPrompts();
    const promptId = req.params.id;
    const promptIndex = prompts.findIndex(p => p.id === promptId);

    if (promptIndex === -1) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    const updatedPrompt = { ...prompts[promptIndex], ...req.body };
    prompts[promptIndex] = updatedPrompt;
    await writePrompts(prompts);
    res.json(updatedPrompt);
  } catch (error) {
    res.status(500).json({ message: "Error updating prompt", error: error.message });
  }
});

// DELETE a prompt
app.delete('/api/prompts/:id', async (req, res) => {
  try {
    let prompts = await readPrompts();
    const promptId = req.params.id;
    const initialLength = prompts.length;
    prompts = prompts.filter(p => p.id !== promptId);

    if (prompts.length === initialLength) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    await writePrompts(prompts);
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ message: "Error deleting prompt", error: error.message });
  }
});

// --- SPA & Static File Serving ---
// Use the history fallback middleware
app.use(history());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
