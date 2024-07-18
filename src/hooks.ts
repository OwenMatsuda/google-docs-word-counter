import { useEffect, useState } from "react";

export default function useSyncStorageState<T>(
  docName: string,
  initialValue: T
): [T, (updateWordCount: (currentState: T) => T) => void] {
  const [state, setInternalState] = useState<T>(initialValue);
  const key = `google-docs-word-counter/${docName}`;

  useEffect(() => {
    chrome.storage.sync.get([key]).then((result) => {
      const value = result[key];
      if (!value) return;

      setInternalState(JSON.parse(value));
    });
  }, []);

  const setState = (updateWordCount: (currentState: T) => T) => {
    setInternalState((oldState) => {
      const newState = updateWordCount(oldState);
      chrome.storage.sync.set({ [key]: JSON.stringify(newState) });

      return newState;
    });
  };

  return [state, setState];
}
