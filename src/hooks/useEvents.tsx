import { useEffect, useState } from "react"
import { FreezeFn } from "../AppProvider";
import api from "../lib/api"
import { CreateEventParams, Event } from "../types/Event";
import { UserHook } from "./useUser";

export interface EventHook {
  events: Event[];
  getEvents: () => void;
  createEvent: (event: CreateEventParams) => void;
}

export const mockUseEvent:EventHook = {
  events: [],
  getEvents: () => {},
  createEvent: () => {}
}

export default function useEvent (user: UserHook, freeze: FreezeFn):EventHook {
  const [events, setLocations] = useState<Event[]> ([]);
  
  const getEvents = async () => {
    try {
      let req = await fetch (`${api}/events`, {
        headers: user.headers.get
      })
      setLocations (await req.json ());
    } catch (e) {
      console.log (e);
    }
  }

  const createEvent = async (location: CreateEventParams) => {
    const unfreeze = freeze ();
    try {
       await fetch (`${api}/locations`, {
         method: 'post',
         headers: user.headers.post,
         body: JSON.stringify (location)
       });
    } catch (e) {
      console.log (e);
    } finally {
      unfreeze ();
    }
  }

  useEffect (() => {
    if (user.isAuthenticated && user.headers.get["x-amz-access-token"]) getEvents ();
  }, [user.isAuthenticated, user.headers.get["x-amz-access-token"]]);

  return {
    events,
    getEvents,
    createEvent
  }
}