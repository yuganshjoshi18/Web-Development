/**
 * Smoke test for the Full-Stack Developer assignment backend.
 *
 * Usage:
 *   1. Start the API:  npm start
 *   2. In another terminal:  npm run test:smoke
 *
 * Override the target with API_URL. Exits with code 1 on failure.
 */

const BASE_URL = process.env.API_URL || 'http://localhost:5001';
const DEMO_USERNAME = process.env.DEMO_USERNAME || 'admin';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'internware';

let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${name}`);
  } else {
    failed += 1;
    failures.push({ name, detail });
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

async function request(method, path, options = {}) {
  const headers = {};

  if (options.body !== undefined || options.rawBody !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { ...headers, ...options.headers },
    body:
      options.rawBody !== undefined
        ? options.rawBody
        : options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return { status: response.status, data };
}

async function main() {
  console.log(`\nFull-stack API smoke test → ${BASE_URL}\n`);

  // Connectivity --------------------------------------------------------------
  const ping = await request('GET', '/ping');
  check('GET /ping returns 200', ping.status === 200, `status ${ping.status}`);
  check('GET /ping returns { status: "ok" }', ping.data?.status === 'ok');

  const unknown = await request('GET', '/nothing-here');
  check('Unknown endpoint returns 404', unknown.status === 404, `status ${unknown.status}`);

  // Authentication ------------------------------------------------------------
  const protectedWithoutToken = await request('GET', '/tasks');
  check(
    'Protected GET /tasks rejects unauthenticated requests (401)',
    protectedWithoutToken.status === 401,
    `status ${protectedWithoutToken.status}`,
  );

  const protectedWithBadToken = await request('GET', '/tasks', { token: 'nope' });
  check(
    'Protected GET /tasks rejects an invalid token (401)',
    protectedWithBadToken.status === 401,
    `status ${protectedWithBadToken.status}`,
  );

  const emptyLogin = await request('POST', '/auth/login', { body: {} });
  check('Login validates required fields (400)', emptyLogin.status === 400, `status ${emptyLogin.status}`);

  const badLogin = await request('POST', '/auth/login', {
    body: { username: DEMO_USERNAME, password: 'wrong-password' },
  });
  check('Login rejects wrong credentials (401)', badLogin.status === 401, `status ${badLogin.status}`);

  const login = await request('POST', '/auth/login', {
    body: { username: DEMO_USERNAME, password: DEMO_PASSWORD },
  });
  check('Login with demo credentials succeeds (200)', login.status === 200, `status ${login.status}`);
  check(
    'Login returns a JWT',
    typeof login.data?.token === 'string' && login.data.token.split('.').length === 3,
  );
  check('Login returns the demo user', login.data?.user?.username === DEMO_USERNAME);

  const token = login.data?.token;

  // Tasks ---------------------------------------------------------------------
  const initialList = await request('GET', '/tasks', { token });
  check('Authenticated GET /tasks returns 200', initialList.status === 200, `status ${initialList.status}`);
  check('GET /tasks returns an array', Array.isArray(initialList.data), `got ${typeof initialList.data}`);

  const missingTitle = await request('POST', '/tasks', {
    token,
    body: { description: 'No title here' },
  });
  check('POST /tasks validates a missing title (400)', missingTitle.status === 400, `status ${missingTitle.status}`);

  const invalidJson = await request('POST', '/tasks', {
    token,
    rawBody: '{"title": "broken"',
  });
  check('Invalid JSON returns 400', invalidJson.status === 400, `status ${invalidJson.status}`);

  const create = await request('POST', '/tasks', {
    token,
    body: {
      title: 'Smoke test task',
      description: 'Created by the full-stack smoke test',
    },
  });
  check('POST /tasks creates a task (201)', create.status === 201, `status ${create.status}`);
  check('New task has a unique id', typeof create.data?.id === 'string' && create.data.id.length > 10);
  check('New task starts incomplete', create.data?.completed === false);
  check('New task has a createdAt timestamp', !Number.isNaN(Date.parse(create.data?.createdAt)));

  const taskId = create.data?.id;

  const listAfterCreate = await request('GET', '/tasks', { token });
  check(
    'GET /tasks includes the created task',
    Array.isArray(listAfterCreate.data) && listAfterCreate.data.some((task) => task.id === taskId),
  );

  const deletion = await request('DELETE', `/tasks/${taskId}`, { token });
  check('DELETE /tasks/:id removes the task (200)', deletion.status === 200, `status ${deletion.status}`);

  const listAfterDelete = await request('GET', '/tasks', { token });
  check(
    'GET /tasks no longer includes the deleted task',
    Array.isArray(listAfterDelete.data) && !listAfterDelete.data.some((task) => task.id === taskId),
  );

  const deleteAgain = await request('DELETE', `/tasks/${taskId}`, { token });
  check('Deleting an unknown task returns 404', deleteAgain.status === 404, `status ${deleteAgain.status}`);

  console.log(`\n${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.log('\nFailures:');
    failures.forEach(({ name, detail }) => console.log(` - ${name}${detail ? ` (${detail})` : ''}`));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('\nSmoke test could not run:', error.message);
  console.error('Is the server running? Try: npm start');
  process.exitCode = 1;
});
