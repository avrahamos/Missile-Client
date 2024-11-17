import React from "react";

interface MissileProps {
  missiles: { name: string; amount: number }[];
  onLoadMissiles: () => void;
  onLaunchMissile: (missileName: string, target: string) => void;
}

const Missiles: React.FC<MissileProps> = ({
  missiles,
  onLoadMissiles,
  onLaunchMissile,
}) => {
  return (
    <div>
      <h2>Missiles</h2>
      <button onClick={onLoadMissiles}>Load Missiles</button>
      <ul>
        {missiles.map((missile) => (
          <li key={missile.name}>
            {missile.name} - {missile.amount} remaining
            {missile.amount > 0 ? (
              <button onClick={() => onLaunchMissile(missile.name, "Target A")}>
                Launch
              </button>
            ) : (
              <span> (Out of missiles)</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Missiles;
