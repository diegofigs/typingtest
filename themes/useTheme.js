import { useContext } from 'react';
import ThemeContext from './context';

export default function useTheme() {
  return useContext(ThemeContext).state.theme;
}

export function useThemeToggle() {
  return useContext(ThemeContext).actions.setTheme;
}