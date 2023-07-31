'use client';

import { GlobalProvide } from '../../../store/user.context';

export interface IGlobalWrapper {
  children: React.ReactNode;
  session?: { user: any };
}

const GlobalWrapper: React.FC<IGlobalWrapper> = ({ children, session }) => {
  //@ts-ignore
  return <GlobalProvide session={session || null}>{children}</GlobalProvide>;
};

export default GlobalWrapper;
