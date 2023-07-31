import { createContext, useContext } from 'react';

interface Session {
  user: any;
}

const GlobalController = ({ session }: { session: Session | null }) => {
  return {
    session,
  };
};

const GlobalContext = createContext<ReturnType<typeof GlobalController>>({
  session: null,
});

export const GlobalProvide = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) => (
  <GlobalContext.Provider value={GlobalController({ session })}>
    {children}
  </GlobalContext.Provider>
);

export const useGlobal = () => useContext(GlobalContext);