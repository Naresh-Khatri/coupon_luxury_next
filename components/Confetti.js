import confetti from "canvas-confetti";
import {useEffect} from 'react'

function Confetti() {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.4 },
      zIndex: 99999999,
    });
  }, []);

  return <></>;
}

export default Confetti;
