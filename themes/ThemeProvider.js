import { useState } from 'react';
import ThemeContext from './context';
import catalog from './constant';

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const value = {
    state: { theme: catalog[theme] },
    actions: { setTheme },
  };
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}