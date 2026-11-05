/**
 * End-to-end smoke test for the Backend Developer assessment.
 *
 * Usage:
 *   1. Start the API:  npm start
 *   2. In another terminal:  npm run test:smoke
 *
 * Override the target with API_URL / DEMO_TOKEN environment variables.
 * The script exits with code 1 if any assertion fails.
 */

const BASE_URL = process.env.API_URL || 'http://localhost:5000';
const DEMO_TOKEN = process.env.DEMO_TOKEN || 'demo-token-internware-2026';

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
  console.log(`\nBackend API smoke test → ${BASE_URL}\n`);

  // Root & unknown route ------------------------------------------------------
  const root = await request('GET', '/');
  check('GET / returns 200', root.status === 200, `status ${root.status}`);
  check('GET / message is "Server running"', root.data?.message === 'Server running');

  const unknown = await request('GET', '/does-not-exist');
  check('Unknown endpoint returns 404', unknown.status === 404, `status ${unknown.status}`);

  const invalidJson = await request('POST', '/tasks', {
    token: DEMO_TOKEN,
    rawBody: '{"title": "broken"',
  });
  check('Invalid JSON returns 400', invalidJson.status === 400, `status ${invalidJson.status}`);

  // Authentication ------------------------------------------------------------
  const noToken = await request('POST', '/tasks', { body: { title: 'Unauthorised task' } });
  check('Protected POST /tasks rejects missing token (401)', noToken.status === 401, `status ${noToken.status}`);

  const badToken = await request('POST', '/tasks', {
    token: 'not-a-real-token',
    body: { title: 'Unauthorised task' },
  });
  check('Protected POST /tasks rejects invalid token (401)', badToken.status === 401, `status ${badToken.status}`);

  const missingSignup = await request('POST', '/signup', { body: { username: 'x' } });
  check('Signup validates required fields (400)', missingSignup.status === 400, `status ${missingSignup.status}`);

  const username = `smoke_${Date.now()}`;
  const signup = await request('POST', '/signup', {
    body: { username, password: 'smoke-pass-123', fullname: 'Smoke Tester' },
  });
  check('Signup creates a user (201)', signup.status === 201, `status ${signup.status}`);
  check('Signup response omits the password hash', signup.data?.user?.passwordHash === undefined);
  check('Signup response exposes the username', signup.data?.user?.username === username);

  const duplicate = await request('POST', '/signup', {
    body: { username, password: 'another-pass', fullname: 'Another Tester' },
  });
  check('Duplicate username is rejected (409)', duplicate.status === 409, `status ${duplicate.status}`);

  const badLogin = await request('POST', '/login', { body: { username, password: 'wrong-password' } });
  check('Wrong password is rejected (401)', badLogin.status === 401, `status ${badLogin.status}`);

  const demoLogin = await request('POST', '/login', { body: { username: 'admin', password: 'internware' } });
  check('Seeded demo user can log in (200)', demoLogin.status === 200, `status ${demoLogin.status}`);
  check('Login returns a JWT', typeof demoLogin.data?.token === 'string' && demoLogin.data.token.split('.').length === 3);

  const jwt = demoLogin.data?.token;

  // Task CRUD -----------------------------------------------------------------
  const initialList = await request('GET', '/tasks');
  check('GET /tasks returns an array', Array.isArray(initialList.data), `got ${typeof initialList.data}`);

  const missingTitle = await request('POST', '/tasks', {
    token: DEMO_TOKEN,
    body: { description: 'No title supplied' },
  });
  check('POST /tasks validates a missing title (400)', missingTitle.status === 400, `status ${missingTitle.status}`);

  const invalidCompleted = await request('POST', '/tasks', {
    token: DEMO_TOKEN,
    body: { title: 'Bad completed value', completed: 'yes' },
  });
  check('POST /tasks validates completed type (400)', invalidCompleted.status === 400, `status ${invalidCompleted.status}`);

  const create = await request('POST', '/tasks', {
    token: DEMO_TOKEN,
    body: { title: 'Smoke test task', description: 'Created by the smoke test' },
  });
  check('POST /tasks with demo token creates a task (201)', create.status === 201, `status ${create.status}`);
  check('Created task has a unique id', typeof create.data?.id === 'string' && create.data.id.length > 10);
  check('Created task defaults completed to false', create.data?.completed === false);
  check('Created task has a createdAt timestamp', !Number.isNaN(Date.parse(create.data?.createdAt)));

  const taskId = create.data?.id;

  const createWithJwt = await request('POST', '/tasks', {
    token: jwt,
    body: { title: 'JWT-protected task' },
  });
  check('POST /tasks with a JWT creates a task (201)', createWithJwt.status === 201, `status ${createWithJwt.status}`);
  const jwtTaskId = createWithJwt.data?.id;

  const list = await request('GET', '/tasks');
  check('GET /tasks includes the new task', Array.isArray(list.data) && list.data.some((task) => task.id === taskId));

  const update = await request('PUT', `/tasks/${taskId}`, {
    token: DEMO_TOKEN,
    body: { title: 'Smoke test task (updated)', completed: true },
  });
  check('PUT /tasks/:id updates supplied fields (200)', update.status === 200, `status ${update.status}`);
  check('PUT preserves the original description', update.data?.description === 'Created by the smoke test');
  check('PUT applies completed=true', update.data?.completed === true);

  const noFields = await request('PUT', `/tasks/${taskId}`, {
    token: DEMO_TOKEN,
    body: {},
  });
  check('PUT with no updatable fields returns 400', noFields.status === 400, `status ${noFields.status}`);

  const completed = await request('GET', '/tasks/done');
  check(
    'GET /tasks/done returns only completed tasks',
    Array.isArray(completed.data) && completed.data.every((task) => task.completed === true),
  );
  check('GET /tasks/done includes the updated task', completed.data?.some((task) => task.id === taskId));

  const missingUpdate = await request('PUT', '/tasks/does-not-exist', {
    token: DEMO_TOKEN,
    body: { title: 'Nope' },
  });
  check('PUT for an unknown id returns 404', missingUpdate.status === 404, `status ${missingUpdate.status}`);

  const deleteResponse = await request('DELETE', `/tasks/${taskId}`, { token: DEMO_TOKEN });
  check('DELETE /tasks/:id removes the task (200)', deleteResponse.status === 200, `status ${deleteResponse.status}`);

  const deleteAgain = await request('DELETE', `/tasks/${taskId}`, { token: DEMO_TOKEN });
  check('DELETE for an unknown id returns 404', deleteAgain.status === 404, `status ${deleteAgain.status}`);

  const missingDelete = await request('DELETE', '/tasks/does-not-exist', { token: DEMO_TOKEN });
  check('DELETE for a nonexistent task returns 404', missingDelete.status === 404, `status ${missingDelete.status}`);

  // Clean up the JWT-created task.
  if (jwtTaskId) {
    await request('DELETE', `/tasks/${jwtTaskId}`, { token: DEMO_TOKEN });
  }

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
