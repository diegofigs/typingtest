import React from 'react'

import { MoonIcon, SunIcon } from '@assets/icons';
import { useTheme, useThemeToggle } from '@theme';

const ToggleTheme = () => {
  const theme = useTheme();
  const toggleTheme = useThemeToggle();
  return (
    <>
      <button className="active" onClick={() => toggleTheme('light')}>
        <SunIcon width={16} height={16}/>
      </button>
      <button onClick={() => toggleTheme('dark')}>
        <MoonIcon width={16} height={16}/>
      </button>
      <style jsx>{`
        .active: {
          border-color: ${theme.correct}
        }
      `}</style>
    </>
  );
};

export default ToggleTheme;