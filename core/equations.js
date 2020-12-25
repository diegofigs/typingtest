export function calculateAccuracy(input, text) {
  const correctKeys = calculateCorrectKeys(input, text);
  return (correctKeys / text.length) * 100;
}
export function calculateNetWPM(input, text, startTime, finishTime) {
  const grossWords = input.length / 5;
  const timeInMinutes = (finishTime - startTime) / 60000; // convert to minutes: 1s / 1000ms * 1m / 60s

  const uncorrectedErrors = input.length - calculateCorrectKeys(input, text);
  return Math.floor((grossWords - uncorrectedErrors) / timeInMinutes);
}
export function calculateWPM(input, startTime, finishTime) {
  const timeInMinutes = (finishTime - startTime) / 60000; // convert to minutes: 1s / 1000ms * 1m / 60s
  const grossWords = input.length / 5;
  return Math.floor(grossWords / timeInMinutes);
}
export function calculateCorrectKeys(input, text) {
  return [...input].reduce((total, char, index) => char === text[index] ? total + 1 : total, 0);
}
