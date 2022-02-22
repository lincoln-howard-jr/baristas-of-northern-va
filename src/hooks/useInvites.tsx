import { useEffect, useState } from 'react';
import { AlertFn, FreezeFn } from '../AppProvider';
import api from '../lib/api';
import Invite from '../types/Invite';
import { UserHook } from './useUser';

export interface InvitesHook {
  openInvites: Invite[];
  createInvite: (invite: Invite) => void;
  acceptInvite: (id: string, email: string) => void;
}

export const mockUseInvite:InvitesHook = {
  openInvites: [],
  createInvite: () => {},
  acceptInvite: () => {},
}

export default function useInvites (user: UserHook, freeze: FreezeFn, alert: AlertFn):InvitesHook {
  const [openInvites, setOpenInvites] = useState<Invite []> (mockUseInvite.openInvites);

  const getOpenInvites = async () => new Promise<void> (async (resolve, reject) => {
    try {
      let req = await fetch (`${api}/invites`, {
        headers: user.headers.get
      });
      setOpenInvites (await req.json ());
      resolve ();
    } catch (e) {
      console.log (e);
      reject (e);
    }
  });

  const createInvite = async (invite: Invite) => {
    let unfreeze = freeze ();
    try {
      let req = await fetch (`${api}/invites`, {
        method: 'post',
        headers: user.headers.post,
        body: JSON.stringify (invite)
      })
      let body = await req.json ();
      if (!req.ok) throw (body.length ? body [0] : 'server error');
    } catch (e) {
      alert ('error', `${e}`);
    } finally {
      unfreeze ();
    }
  }

  const acceptInvite = async (id: string, email: string) => {
    let unfreeze = freeze ();
    try {
      const req = await fetch (`${api}/users/${id}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify ({email})
      });
      const body = await req.json ();
      if (!req.ok) throw (body.length ? body [0] : 'server error');
      user.login (body.memberEmail, body.TemporaryPassword);
    } catch (e) {
      alert ('error', `${e}`);
    } finally {
      unfreeze ();
    }
  }

  useEffect (() => {
    if (user.isAuthenticated && user.headers.get["x-amz-access-token"]) {
      getOpenInvites ();
    }
  }, [user.isAuthenticated, user.headers.get["x-amz-access-token"]])

  return {
    openInvites,
    createInvite,
    acceptInvite
  }
}