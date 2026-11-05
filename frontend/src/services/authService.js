export const DEMO_CREDENTIALS = Object.freeze({
  username: 'admin',
  password: 'internware',
});

const DEMO_USER = Object.freeze({
  id: 'usr_northwind_admin',
  name: 'Alex Morgan',
  username: 'admin',
  role: 'Studio Administrator',
  email: 'admin@northwind.studio',
});

/**
 * Mock authentication for the Frontend Developer assessment.
 *
 * The deliberate delay gives the UI a realistic loading state. Swap this
 * implementation for a real API call without changing the context or pages.
 */
export function login({ username, password }) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const matchesUsername =
        username.trim().toLowerCase() === DEMO_CREDENTIALS.username &&
        password === DEMO_CREDENTIALS.password;

      if (!matchesUsername) {
        reject(new Error('The username or password you entered is incorrect.'));
        return;
      }

      resolve({
        token: `demo-session-${Date.now()}`,
        user: { ...DEMO_USER },
      });
    }, 850);
  });
}
