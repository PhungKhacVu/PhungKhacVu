const { spawn } = require('child_process');
const http = require('http');

const PORT = 3001; // Use a different port for testing

async function startServer() {
  return new Promise((resolve, reject) => {
    const serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT },
      stdio: 'pipe'
    });

    serverProcess.stdout.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes(`Server is listening on port ${PORT}`)) {
        resolve(serverProcess);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });

    serverProcess.on('error', (err) => {
      reject(err);
    });
  });
}

async function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                 resolve(data ? JSON.parse(data) : null);
            } else {
                 reject(new Error(`Request failed with status ${res.statusCode}: ${data}`));
            }
        } catch (e) {
            reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  let serverProcess;
  try {
    console.log('Starting server...');
    serverProcess = await startServer();
    console.log('Server started.');

    // 1. GET all prompts (should be empty or existing)
    console.log('Testing GET /api/prompts...');
    const initialPrompts = await request('GET', '/api/prompts');
    console.log(`Initial prompts count: ${initialPrompts.length}`);

    // 2. POST a new prompt
    console.log('Testing POST /api/prompts...');
    const newPrompt = {
      title: 'Test Prompt',
      content: 'This is a test prompt',
      tags: ['test']
    };
    const createdPrompt = await request('POST', '/api/prompts', newPrompt);
    console.log('Created prompt:', createdPrompt.id);

    // 3. GET all prompts again (should verify addition)
    const promptsAfterPost = await request('GET', '/api/prompts');
    if (promptsAfterPost.length !== initialPrompts.length + 1) {
      throw new Error('POST failed: Prompt count did not increase.');
    }

    // 4. PUT (update) the prompt
    console.log('Testing PUT /api/prompts/:id...');
    const updatedData = {
      title: 'Updated Test Prompt'
    };
    const updatedPrompt = await request('PUT', `/api/prompts/${createdPrompt.id}`, updatedData);
    if (updatedPrompt.title !== 'Updated Test Prompt') {
      throw new Error('PUT failed: Title not updated.');
    }

    // 5. DELETE the prompt
    console.log('Testing DELETE /api/prompts/:id...');
    await request('DELETE', `/api/prompts/${createdPrompt.id}`);

    // 6. GET all prompts again (should verify deletion)
    const finalPrompts = await request('GET', '/api/prompts');
    if (finalPrompts.length !== initialPrompts.length) {
      throw new Error('DELETE failed: Prompt count mismatch.');
    }

    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

runTests();
