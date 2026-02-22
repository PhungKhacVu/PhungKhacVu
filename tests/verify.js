const { spawn } = require('child_process');
const http = require('http');

function waitForServer(port) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds
    const tryConnect = () => {
      attempts++;
      const req = http.get(`http://localhost:${port}/api/prompts`, (res) => {
        if (res.statusCode === 200) {
          res.resume(); // consume response data to free up memory
          resolve();
        } else {
          if (attempts < maxAttempts) setTimeout(tryConnect, 100);
          else reject(new Error('Server failed to start (status check failed)'));
        }
      });
      req.on('error', () => {
        if (attempts < maxAttempts) setTimeout(tryConnect, 100);
        else reject(new Error('Server failed to start (connection refused)'));
      });
      req.end();
    };
    tryConnect();
  });
}

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: options.method || 'GET',
        headers: options.headers || {}
    };

    if (body) {
        const bodyStr = JSON.stringify(body);
        reqOptions.headers['Content-Type'] = 'application/json';
        reqOptions.headers['Content-Length'] = Buffer.byteLength(bodyStr);

        const req = http.request(reqOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : null;
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });
        req.on('error', reject);
        req.write(bodyStr);
        req.end();
    } else {
        const req = http.request(reqOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : null;
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });
        req.on('error', reject);
        req.end();
    }
  });
}

async function runTest() {
  console.log('Starting server...');
  const server = spawn(process.execPath, ['server.js'], { stdio: 'inherit' });

  // Give the server a moment to initiate startup
  await new Promise(r => setTimeout(r, 1000));

  try {
    await waitForServer(3000);
    console.log('Server is ready.');

    // 1. GET /api/prompts
    console.log('Testing GET /api/prompts...');
    const getRes = await request('http://localhost:3000/api/prompts');
    if (getRes.status !== 200 || !Array.isArray(getRes.body)) {
      throw new Error(`GET failed: ${getRes.status} ${JSON.stringify(getRes.body)}`);
    }
    console.log(`GET success. Found ${getRes.body.length} prompts.`);
    const initialCount = getRes.body.length;

    // 2. POST /api/prompts
    console.log('Testing POST /api/prompts...');
    const newPrompt = {
      title: 'Test Prompt',
      description: 'Created by verify.js',
      basePrompt: 'Test content',
      techniqueCategory: 'TEST',
      primaryTechnique: 'None',
      useCase: 'Test',
      parameters: [],
      notes: 'Test note'
    };
    const postRes = await request('http://localhost:3000/api/prompts', { method: 'POST' }, newPrompt);

    if (postRes.status !== 201 || !postRes.body.id) {
        throw new Error(`POST failed: ${postRes.status} ${JSON.stringify(postRes.body)}`);
    }
    console.log('POST success. Created prompt ID:', postRes.body.id);
    const createdId = postRes.body.id;

    // 3. GET /api/prompts again to verify persistence/cache update
    console.log('Testing GET /api/prompts again...');
    const getRes2 = await request('http://localhost:3000/api/prompts');
    if (getRes2.body.length !== initialCount + 1) {
        throw new Error(`GET verify failed: Count mismatch. Expected ${initialCount + 1}, got ${getRes2.body.length}`);
    }
    const found = getRes2.body.find(p => p.id === createdId);
    if (!found) {
        throw new Error('GET verify failed: New prompt not found in list.');
    }
    console.log('GET verify success. Found created prompt.');

    // 4. DELETE created prompt
    console.log('Cleaning up (DELETE)...');
    const delRes = await request(`http://localhost:3000/api/prompts/${createdId}`, { method: 'DELETE' });
    if (delRes.status !== 204) {
        throw new Error(`DELETE failed: ${delRes.status}`);
    }
    console.log('DELETE success.');

    // 5. Final Verify
    const getRes3 = await request('http://localhost:3000/api/prompts');
    if (getRes3.body.length !== initialCount) {
         throw new Error(`Final verify failed: Count mismatch. Expected ${initialCount}, got ${getRes3.body.length}`);
    }

    console.log('All tests passed!');
    server.kill();
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    server.kill();
    process.exit(1);
  }
}

runTest();
