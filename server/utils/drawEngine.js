export const generateDrawNumbers = () => {
  const numbers = new Set();

  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }

  return [...numbers];
};

export const countMatches = (userScores, drawNumbers) => {
  return userScores.filter((score) => drawNumbers.includes(score)).length;
};
