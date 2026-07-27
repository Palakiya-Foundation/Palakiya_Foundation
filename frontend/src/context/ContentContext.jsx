import { createContext, useContext, useEffect, useRef, useState } from 'react';
import api from '../api/client.js';

const ContentContext = createContext({});

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const refresh = () => {
    setLoading(true);
    return api
      .get('/content')
      .then((res) => {
        if (mountedRef.current) setContent(res.data);
        return res.data;
      })
      .catch((err) => {
        if (mountedRef.current) setContent({});
        throw err; // Propagate so callers can handle
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });
  };

  useEffect(() => {
    mountedRef.current = true;
    refresh().catch(() => {});
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, refresh }}>
      {children}
    </ContentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useContent = () => useContext(ContentContext);
