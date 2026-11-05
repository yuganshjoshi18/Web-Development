function getInitialTheme() {
  try {
    return localStorage.getItem('northwind.theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export { getInitialTheme };
