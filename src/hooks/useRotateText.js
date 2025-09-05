import { useState, useEffect } from "react";

const useRotateText = (words, interval = 200) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [displayedText, setDisplayedText] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const updateText = () => {
      const currentWord = words[currentWordIndex];

      // Update displayed text first
      setDisplayedText(currentWord.slice(0, characterIndex));
													

      // Check conditions before updating character index
      if (direction === 1 && characterIndex >= currentWord.length) {
        // Pause before starting deletion
        setIsPaused(true);
        setTimeout(() => {
          setDirection(-1);
          setIsPaused(false);
        }, 500);
        return;
      }

      if (direction === -1 && characterIndex <= 0) {
        // Pause before moving to next word
        setIsPaused(true);
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setDirection(1);
          setCharacterIndex(0);
          setIsPaused(false);
        }, 200);
        return;
      }

      // Update character index after conditions are checked
      setCharacterIndex((prev) => prev + direction);
    };

    const timer = setInterval(updateText, interval);
    return () => clearInterval(timer);
  }, [characterIndex, direction, words, currentWordIndex, interval, isPaused]);

  return displayedText;
};

export default useRotateText;
