import React from "react";
import Defenses from "./Defenses";
import Missiles from "./Missiles";
import { useDashboardHooks } from "../../hooks/DashboardHooks";

export default function Dashboard() {
  const {
    user,
    defenses,
    missiles,
    isUnderAttack,
    incomingMissile,
    handleGetDefenses,
    handleGetMissiles,
    handleIntercept,
    handleLaunchMissile,
  } = useDashboardHooks();

  if (!user) {
    return <div>Loading user...</div>;
  }

  const adaptedIncomingMissile = incomingMissile
    ? {
        missileName: incomingMissile.missileName,
        speed: incomingMissile.speed,
        launchedBy: incomingMissile.launchedBy,
      }
    : null;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <h2>Welcome {user.userName}</h2>
      {user.organization === "IDF" ? (
        <Defenses
          defenses={defenses}
          isUnderAttack={isUnderAttack}
          incomingMissile={adaptedIncomingMissile}
          onLoadDefenses={handleGetDefenses}
          onIntercept={handleIntercept}
        />
      ) : (
        <Missiles
          missiles={missiles}
          onLoadMissiles={handleGetMissiles}
          onLaunchMissile={handleLaunchMissile}
        />
      )}
      {isUnderAttack && incomingMissile && (
        <div className="incoming-warning">
          <p>
            Incoming missile: {incomingMissile.missileName} with speed{" "}
            {incomingMissile.speed} targeted at {incomingMissile.launchedBy}!
          </p>
        </div>
      )}
    </div>
  );
}
