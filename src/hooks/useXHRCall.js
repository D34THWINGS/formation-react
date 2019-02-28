import { useEffect } from 'react';

export const useXHRCall = (url, options, dispatch, prefix) => {
  useEffect(() => {
    dispatch({ type: `${prefix}_START` });
    (async () => {
      try {
        const controller = new AbortController();
        const response = await fetch(url, { ...options, signal: controller.signal });
        dispatch({ type: `${prefix}_SUCCESS`, payload: await response.json() });
      } catch (e) {
        dispatch({ type: `${prefix}_ERROR` });
      }
    })();
  }, []);
};

export const handleCall = actionPrefix => (state, action) => {
  switch (action.type) {
    case `${actionPrefix}_START`:
      return {
        ...state,
        loading: true,
        error: false,
        data: [],
      };
    case `${actionPrefix}_SUCCESS`:
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload,
      };
    case `${actionPrefix}_ERROR`:
      return {
        ...state,
        loading: false,
        error: true,
        data: [],
      };
    default:
      return state;
  }
};
