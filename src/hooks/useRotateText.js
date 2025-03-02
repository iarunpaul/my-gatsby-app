import { useState, useEffect } from "react";

const useRotateText = (words, interval = 200) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    const updateText = () => {
      const currentWord = words[currentWordIndex];

      setDisplayedText(currentWord.slice(0, characterIndex));
      setCharacterIndex((prev) => prev + direction);

      if (direction === 1 && characterIndex >= currentWord.length) {
        setTimeout(() => setDirection(-1), 500); // Pause before deleting
      }

      if (direction === -1 && characterIndex === 0) {
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setDirection(1);
        }, 200);
      }
    };

    const timer = setInterval(updateText, interval);
    return () => clearInterval(timer);
  }, [characterIndex, direction, words, currentWordIndex, interval]);

  return displayedText;
};

export default useRotateText;
