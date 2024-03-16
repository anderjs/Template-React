import { useState, useEffect, useRef, useCallback } from "react";

export const useTimeoutState = (
  initialState: boolean,
  duration = 100
): [boolean, () => void] => {
  const isMounted = useRef(false);

  const timeout = useRef<NodeJS.Timeout>();

  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (!state && isMounted.current) {
      timeout.current = setTimeout(() => {
        setState(true);
      }, duration);
    }
    return () => {
      if (isMounted.current && timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [state, duration]);

  const setOpen = useCallback(() => {
    isMounted.current = true;

    setState(false);
  }, []);

  return [state, setOpen];
};
