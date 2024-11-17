import React, { useEffect, useState } from "react";
import { interceptors } from "../../utils/utils";
import { InterceptorName } from "../../types/user";

interface DefenseProps {
  defense: { name: InterceptorName; amount: number };
  isUnderAttack: boolean;
  incomingMissile: { missileName: string; speed: number } | null;
  onIntercept: (defenseName: InterceptorName) => void;
}

export default function DefenseItem({
  defense,
  isUnderAttack,
  incomingMissile,
  onIntercept,
}: DefenseProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const canIntercept =
    isUnderAttack &&
    incomingMissile &&
    interceptors[defense.name]?.includes(incomingMissile.missileName);

  useEffect(() => {
    if (!isUnderAttack || !incomingMissile) {
      setTimeLeft(null);
      return;
    }

    let remainingTime = incomingMissile.speed; 
    setTimeLeft(remainingTime);

    const interval = setInterval(() => {
      remainingTime -= 1;
      setTimeLeft(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(interval);
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isUnderAttack, incomingMissile]);

  return (
    <li>
      {defense.name} - {defense.amount} remaining
      {canIntercept && defense.amount > 0 ? (
        <>
          <button onClick={() => onIntercept(defense.name)}>Intercept</button>
          {timeLeft !== null && <span> Time left: {timeLeft}s</span>}
        </>
      ) : (
        <span> (Cannot intercept)</span>
      )}
    </li>
  );
}
