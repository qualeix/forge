import { createContext, useContext, useState, ReactNode } from "react";
import { checkForUpdate, UpdateInfo } from "./updater";

interface UpdateContextValue {
  updateInfo: UpdateInfo | null;
  checking: boolean;
  upToDate: boolean;
  triggerCheck: () => Promise<void>;
  dismiss: () => void;
}

const UpdateContext = createContext<UpdateContextValue>({
  updateInfo: null,
  checking: false,
  upToDate: false,
  triggerCheck: async () => {},
  dismiss: () => {},
});

export function UpdateProvider({ children }: { children: ReactNode }) {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [checking, setChecking] = useState(false);
  const [upToDate, setUpToDate] = useState(false);

  const triggerCheck = async () => {
    setChecking(true);
    setUpToDate(false);
    const info = await checkForUpdate();
    if (info) {
      setUpdateInfo(info);
    } else {
      setUpToDate(true);
    }
    setChecking(false);
  };

  const dismiss = () => setUpdateInfo(null);

  return (
    <UpdateContext.Provider value={{ updateInfo, checking, upToDate, triggerCheck, dismiss }}>
      {children}
    </UpdateContext.Provider>
  );
}

export const useUpdate = () => useContext(UpdateContext);
