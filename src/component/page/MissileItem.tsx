import React, { useState } from "react";
import { locationsList } from "../../utils/utils";

interface MissileItemProps {
  missile: { name: string; amount: number; speed: number }; 
  onLaunchMissile: (missileName: string, target: string) => void;
}

export default function MissileItem({
  missile,
  onLaunchMissile,
}: MissileItemProps) {
  const [target, setTarget] = useState(locationsList[0]);
  const [launchTime, setLaunchTime] = useState<number | null>(null); 

  const handleLaunch = () => {
    if (missile.amount <= 0) {
      alert("No missiles available to launch.");
      return;
    }

    setLaunchTime(missile.speed); 
    onLaunchMissile(missile.name, target);

    const interval = setInterval(() => {
      setLaunchTime((prev) => {
        if (prev !== null) {
          if (prev <= 1) {
            clearInterval(interval);
            return null;
          }
          return prev - 1;
        }
        return null;
      });
    }, 1000);
  };

  return (
    <li>
      {missile.name} - {missile.amount} units
      {launchTime !== null ? (
        <span> (Launching in {launchTime}s)</span> 
      ) : (
        <>
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            {locationsList.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <button onClick={handleLaunch}>Launch</button>
        </>
      )}
    </li>
  );
}
