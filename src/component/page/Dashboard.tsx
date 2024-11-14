import React, { useEffect } from "react";
import { connectSocket, getSocket } from "../../socket/socket";
import { useAppSelector, useAppDispatch } from "../../redux/store/store";
import { fetchUserProfile } from "../../redux/fetchs/fetches";
import { IDefense, IMissile } from "../../types/user";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const [defenses, setDefenses] = React.useState<IDefense[]>([]);
  const [missiles, setMissiles] = React.useState<IMissile[]>([]);
  const [isUnderAttack, setIsUnderAttack] = React.useState(false);
  const [launchedMissile, setLaunchedMissile] = React.useState<{
    name: string;
    target: string;
  } | null>(null);
  const [interceptedMissile, setInterceptedMissile] = React.useState<
    string | null
  >(null);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
      return;
    }

    console.log("User loaded from redux:", user);

    const token = localStorage.getItem("authorization");
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    const socket = connectSocket(token);

    socket.on("connect", () => {
      console.log("WebSocket connected successfully");
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    socket.on("error", (error) => {
      console.error("Socket error received:", error);
    });

    socket.on("missileLaunched", (data) => {
      console.log("Missile launched, enabling intercept option", data);
      setIsUnderAttack(true);
      setLaunchedMissile({ name: data.missileName, target: data.target });
    });

    socket.on("missileIntercepted", (data) => {
      console.log("Missile intercepted successfully", data);
      setIsUnderAttack(false);
      setInterceptedMissile(data.missileName);
    });

    return () => {
      console.log("Disconnecting WebSocket");
      socket.disconnect();
    };
  }, [user, dispatch]);

  const handleGetDefenses = () => {
    const socket = getSocket();
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    const location = user?.location; 
    if (!location) {
      console.error("Location is missing in user data");
      return;
    }

    console.log("Sending 'getDefenses' event with location:", location);

    socket.emit("getDefenses", { location }, (response: any) => {
      if (response.success) {
        console.log("Defenses received:", response.data);
        if (response.data && response.data.resources) {
          setDefenses(response.data.resources || []);
        } else {
          console.error("Unexpected data format received:", response.data);
        }
      } else {
        console.error("Error fetching defenses:", response.message);
      }
    });
  };

  const handleGetMissiles = () => {
    const socket = getSocket();
    if (!socket || user?.organization === "IDF") {
      console.error("Unauthorized to fetch missiles");
      return;
    }

    console.log("Sending 'getMissiles' event");

    socket.emit(
      "getMissiles",
      { organization: user?.organization },
      (response: any) => {
        if (response.success) {
          console.log("Missiles received:", response.data);
          setMissiles(response.data || []);
        } else {
          console.error("Error fetching missiles:", response.message);
        }
      }
    );
  };

  const handleIntercept = (missileName: string) => {
    const socket = getSocket();
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    console.log(`Intercepting missile: ${missileName}`);

    socket.emit("interceptMissile", { missileName }, (response: any) => {
      if (response.success) {
        console.log("Missile intercepted successfully:", response.message);
        alert(`Missile ${missileName} intercepted successfully!`);
        setIsUnderAttack(false);
        setLaunchedMissile(null);
        setInterceptedMissile(missileName);
      } else {
        console.error("Error intercepting missile:", response.message);
        alert(`Failed to intercept missile: ${response.message}`);
      }
    });
  };

  const handleLaunchMissile = () => {
    const socket = getSocket();
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    const target = location

    console.log("Launching missile");

    socket.emit(
      "launchMissile",
      { organization: user?.organization, target },
      (response: any) => {
        if (response.success) {
          console.log("Missile launched successfully:", response.message);
          alert(`Missile launched successfully towards ${target}!`);
        } else {
          console.error("Error launching missile:", response.message);
          alert(`Failed to launch missile: ${response.message}`);
        }
      }
    );
  };

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome {user.userName}</h2>
      {user.organization === "IDF" ? (
        <>
          <button onClick={handleGetDefenses}>Load defenses</button>
          <ul>
            {Array.isArray(defenses) && defenses.length > 0 ? (
              defenses.map((defense, index) => (
                <li key={index}>
                  {defense.name} - {defense.amount} units
                </li>
              ))
            ) : (
              <p>No defenses available</p>
            )}
          </ul>
        </>
      ) : (
        <>
          <button onClick={handleGetMissiles}>Load missiles</button>
          <ul>
            {Array.isArray(missiles) && missiles.length > 0 ? (
              missiles.map((missile, index) => (
                <li key={index}>
                  {missile.name} - {missile.amount} units
                  {isUnderAttack && (
                    <button onClick={() => handleIntercept(missile.name)}>
                      Intercept
                    </button>
                  )}
                </li>
              ))
            ) : (
              <p>No missiles available</p>
            )}
          </ul>
        </>
      )}
      <button onClick={handleLaunchMissile}>Launch Missile</button>
      {launchedMissile && (
        <p>
          Missile <strong>{launchedMissile.name}</strong> launched towards{" "}
          <strong>{launchedMissile.target}</strong>
        </p>
      )}
      {interceptedMissile && (
        <p>
          Missile <strong>{interceptedMissile}</strong> intercepted
          successfully!
        </p>
      )}
    </div>
  );
}
