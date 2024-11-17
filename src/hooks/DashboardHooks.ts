import { useEffect, useState } from "react";
import { connectSocket } from "../socket/socket";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import { fetchUserProfile } from "../redux/fetchs/fetches";
import { IDefense, IMissile } from "../types/user";
import { interceptors } from "../utils/utils";
import localMissiles from "../data/missiles.json";

export const useDashboardHooks = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const [socket, setSocket] = useState<any>(null);
  const [defenses, setDefenses] = useState<IDefense[]>([]);
  const [missiles, setMissiles] = useState<IMissile[]>([]);
  const [isUnderAttack, setIsUnderAttack] = useState(false);
  const [incomingMissile, setIncomingMissile] = useState<{
    missileName: string;
    speed: number;
    launchedBy: string;
  } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
      return;
    }

    const token = localStorage.getItem("authorization");
    if (!token) return;

    const socket = connectSocket(token);
    setSocket(socket);

    socket.on("connect", () => {
    });

    socket.on("missileLaunched", (data) => {
      if (user.organization === "IDF") {
        setIsUnderAttack(true);

        const missileData = localMissiles.find(
          (missile) => missile.name === data.missileName
        );

        if (!missileData) {
          console.warn(`Missile ${data.missileName} not found in local data.`);
          setIncomingMissile({ ...data, speed: 0 });
          return;
        }

        setIncomingMissile({ ...data, speed: missileData.speed });

        const defense = defenses.find((d) =>
          interceptors[d.name]?.includes(data.missileName)
        );

        if (defense) {
          const interceptTime = missileData.speed - defense.speed;
          if (interceptTime > 0) {
            setTimeRemaining(interceptTime);
            const timer = setInterval(() => {
              setTimeRemaining((prev) => {
                if (prev === null || prev <= 1) {
                  clearInterval(timer);
                  return null;
                }
                return prev - 1;
              });
            }, 1000);
          } else {
            setTimeRemaining(0);
          }
        }
      }
    });

    socket.on("missileIntercepted", (data) => {
      setIsUnderAttack(false);
      setIncomingMissile(null);
      setTimeRemaining(null);
      updateDefenseMissileCount(data.defenseName);
    });

    socket.on("disconnect", () => {
      setIsUnderAttack(false);
      setIncomingMissile(null);
      setTimeRemaining(null);
    });

    socket.on("error", (error) => {
      console.error("[Client] WebSocket error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, dispatch, defenses]);

  const handleGetDefenses = () => {
    if (!socket) return;

    socket.emit(
      "getDefenses",
      { location: user?.location },
      (response: any) => {
        if (response.success) setDefenses(response.data.resources || []);
      }
    );
  };

  const handleGetMissiles = () => {
    if (user?.organization === "IDF") return;

    socket.emit(
      "getMissiles",
      { organization: user?.organization },
      (response: any) => {
        if (response.success) setMissiles(response.data || []);
      }
    );
  };

  const handleIntercept = (defenseName: string) => {
    if (!socket || !incomingMissile) return;

    const defense = defenses.find((d) => d.name === defenseName);

    if (!defense) {
      alert("Defense system not found.");
      return;
    }

    const canIntercept = interceptors[defense.name]?.includes(
      incomingMissile.missileName
    );

    if (!canIntercept) {
      alert("This defense system cannot intercept the incoming missile.");
      return;
    }

    socket.emit(
      "interceptMissile",
      { defenseName, missileName: incomingMissile.missileName },
      (response: any) => {
        if (response.success) {
          alert(`Missile intercepted successfully by ${defenseName}!`);
          updateDefenseMissileCount(defenseName);
        } else {
          alert("Interception failed.");
        }
      }
    );
  };

  const handleLaunchMissile = (missileName: string, target: string) => {
    if (!socket) return;

    const missile = missiles.find((m) => m.name === missileName);

    if (!missile) {
      alert("Missile not found.");
      return;
    }

    socket.emit(
      "launchMissile",
      { organization: user?.organization, missileName, target },
      (response: any) => {
        if (response.success) {
          alert(
            `Missile ${missileName} launched successfully towards ${target}!`
          );
          updateMissileCount(missileName);
        } else {
          alert("Missile launch failed.");
        }
      }
    );
  };

  const updateMissileCount = (missileName: string) => {
    setMissiles((prevMissiles) =>
      prevMissiles.map((m) =>
        m.name === missileName ? { ...m, amount: m.amount - 1 } : m
      )
    );
  };

  const updateDefenseMissileCount = (defenseName: string) => {
    setDefenses((prevDefenses) =>
      prevDefenses.map((d) =>
        d.name === defenseName ? { ...d, amount: d.amount - 1 } : d
      )
    );
  };

  return {
    user,
    defenses,
    missiles,
    isUnderAttack,
    incomingMissile,
    timeRemaining,
    handleGetDefenses,
    handleGetMissiles,
    handleIntercept,
    handleLaunchMissile,
  };
};
