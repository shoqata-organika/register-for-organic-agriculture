import { createContext } from 'react';
import { User } from '@/api/types/user';

export const UserContext = createContext<User | null>(null);
