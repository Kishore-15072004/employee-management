import { useCallback, useState } from 'react';

export default function useAsync() {
  const [state, setState] = useState({ data: null, loading: false, error: '' });
  const run = useCallback(async (operation) => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await operation();
      setState({ data: response.data, loading: false, error: '' });
      return response.data;
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.message || 'Request failed.' }));
      return null;
    }
  }, []);
  return { ...state, run };
}