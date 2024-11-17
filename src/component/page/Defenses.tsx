import React from "react";
import DefenseItem from "./DefenseItem";
import { IDefense } from "../../types/user";

interface DefensesProps {
  defenses: IDefense[];
  isUnderAttack: boolean;
  incomingMissile: { missileName: string; speed: number } | null; 
  onLoadDefenses: () => void; 
  onIntercept: (defenseName: string) => void; 
}

export default function Defenses({
  defenses,
  isUnderAttack,
  incomingMissile,
  onLoadDefenses,
  onIntercept,
}: DefensesProps) {
  return (
    <div>
      <h2>Defensive Systems</h2>
      <button onClick={onLoadDefenses}>Load Defenses</button>
      <ul>
        {defenses.length > 0 ? (
          defenses.map((defense) => (
            <DefenseItem
              key={defense.name}
              defense={defense}
              isUnderAttack={isUnderAttack}
              incomingMissile={incomingMissile}
              onIntercept={onIntercept}
            />
          ))
        ) : (
          <p>No defensive systems available</p>
        )}
      </ul>
      {!isUnderAttack && <p>No active threats detected.</p>}
    </div>
  );
}
