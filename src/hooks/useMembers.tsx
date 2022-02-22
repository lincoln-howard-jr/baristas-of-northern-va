import { useEffect, useState } from "react";
import { AlertFn, FreezeFn } from "../AppProvider";
import api from "../lib/api";
import Member, { MemberUpdate } from "../types/Member";
import { UserHook } from "./useUser";

export interface MembersHook {
  members: Member[];
  invitedByMe: Member[];
  me: Member | null;
  updateInfo: (update: MemberUpdate) => void;
  adminUpdateInfo: (update: MemberUpdate, id: string) => void;
  findById: (id: string) => Member | undefined;
}

export const mockUseMember:MembersHook = {
  members: [],
  invitedByMe: [],
  me: null,
  updateInfo: () => {},
  adminUpdateInfo: () => {},
  findById: () => undefined
}

export default function useMembers (freeze: FreezeFn, alert: AlertFn, user: UserHook):MembersHook {
  const [members, setMembers] = useState<Member[]> (mockUseMember.members);
  const [invitedByMe, setInvitedByMe] = useState<Member[]> ([]);
  const [me, setMe] = useState<Member | null> (null);

  const getMembers = async () => {
    try {
      let req = await fetch (`${api}/users`, {
        headers: user.headers.get
      });
      let ms = await req.json () as Member[];
      let meIndex = ms.findIndex (m => m.memberName === user.name);
      if (meIndex !== -1) {
        let [_me] = ms.splice (meIndex, 1);
        setMe (_me);
      }
      setMembers (ms);
    } catch (e) {
    }
  }

  const findById = (id: string) => {
    if (me?.id === id) return me;
    return members.find (m => m.id === id);
  }
  
  const updateInfo = async (update: MemberUpdate) => {
    let unfreeze = freeze ();
    try {
      let req = await fetch (`${api}/users`, {
        method: 'PATCH',
        headers: user.headers.post,
        body: JSON.stringify (update)
      })
      if (req.ok) {
        let res = await req.json ();
        alert ('info', res [0])
      }
    } catch (e) {
      alert ('error', `${e}`);
    } finally {
      unfreeze ();
    }
  }


  const adminUpdateInfo = async (update: MemberUpdate, id: string) => {
    let unfreeze = freeze ();
    try {
      let req = await fetch (`${api}/users/${id}`, {
        method: 'PATCH',
        headers: user.headers.post,
        body: JSON.stringify (update)
      })
      if (req.ok) {
        let res = await req.json ();
        alert ('info', res [0])
      }
    } catch (e) {
      alert ('error', `${e}`);
    } finally {
      unfreeze ();
    }
  }

  useEffect (() => {
    if (user.isAuthenticated && user.headers.get ["x-amz-access-token"] && user.name) getMembers ();
  }, [user.isAuthenticated, user.name]);

  useEffect (() => {
      if (me) setInvitedByMe (members.filter (m => m.invitedBy?.id === me?.id));
  }, [members, me]);

  return {
    members,
    invitedByMe,
    me,
    updateInfo,
    adminUpdateInfo,
    findById
  }
}