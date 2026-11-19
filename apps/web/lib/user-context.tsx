'use client';

import { createContext, useContext } from 'react';

export type CurrentUser = { email: string; role: string; pages: string[] };

export const UserContext = createContext<CurrentUser | null>(null);

export const useCurrentUser = () => useContext(UserContext);
