import { useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export type AuthUser = FirebaseUser & { role?: string };

export const useAuthUser = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const idTokenResult = await u.getIdTokenResult();
          const role = (idTokenResult.claims.role as string) || 
                       (u.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? 'super_admin' : 'basic');
          
          // Use Object.assign to preserve functions and prototype of the user object
          const authUser = Object.assign(u, { role }) as AuthUser;
          setUser(authUser);
        } catch (error) {
          console.error('Error fetching token result in useAuthUser:', error);
          setUser(u as AuthUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
};
