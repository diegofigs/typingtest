import { useState, useEffect } from 'react';

export default function useKeyPress(callback) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  const downHandler = (event) => {
    if (keyPressed !== event.key && event.key.length === 1) {
      setKeyPressed(true);
      if (callback) callback(event);
    }
  }

  // If released key is our target key then set to false
  const upHandler = (event) => {
    setKeyPressed(false);
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}