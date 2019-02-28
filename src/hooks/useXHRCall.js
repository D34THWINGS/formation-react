import { useState, useEffect } from 'react';

const useXHRCall = (url, options = {}, defaultValue = []) => {
  const [state, setState] = useState({ loading: false, error: false, data: defaultValue });
  useEffect(() => {
    setState({ ...state, loading: true });
    const controller = new AbortController();
    fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { ...options.headers, 'Content-Type': 'application/json' },
    })
      .then(async response => setState({ ...state, loading: false, data: await response.json() }))
      .catch((e) => {
        console.error(e);
        setState({ ...state, loading: false, error: true });
      });
    return () => controller.abort();
  }, []);
  return [state, setState];
};

export default useXHRCall;
