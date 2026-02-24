import { useUser } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';
import { apiClient } from '../api/client';

/**
 * Syncs the currently authenticated Clerk user to the backend database.
 * Should be called once when the user is signed in.
 */
export const useUserSync = () => {
    const { isSignedIn, user } = useUser();
    const hasSynced = useRef(false);

    useEffect(() => {
        // Only sync once per session when the user is confirmed signed-in
        if (!isSignedIn || !user || hasSynced.current) return;

        const syncUserToDb = async () => {
            try {
                await apiClient.post('/users/sync', {
                    fullName: user.fullName || user.firstName || 'User',
                    email: user.primaryEmailAddress?.emailAddress || '',
                });
                hasSynced.current = true;
                console.log('[LifeOS] User synced to DB ✅');
            } catch (error) {
                console.error('[LifeOS] Failed to sync user to DB:', error);
            }
        };

        syncUserToDb();
    }, [isSignedIn, user]);
};
