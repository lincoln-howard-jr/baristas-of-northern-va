import { useEffect, useState } from "react"
import { FreezeFn } from "../AppProvider";
import api from "../lib/api"
import Location, { CreateLocationParams } from "../types/Location"
import { UserHook } from "./useUser";

export interface LocationHook {
  locations: Location[];
  getLocations: () => void;
  createLocation: (location: CreateLocationParams) => void;
  deleteLocation: (id: string) => void;
}

export const mockUseLocation:LocationHook = {
  locations: [],
  getLocations: () => {},
  createLocation: () => {},
  deleteLocation: () => {}
}

export default function useLocation (user: UserHook, freeze: FreezeFn):LocationHook {
  const [locations, setLocations] = useState<Location[]> ([]);
  
  const getLocations = async () => {
    try {
      let req = await fetch (`${api}/locations`, {
        headers: user.headers.get
      })
      setLocations (await req.json ());
    } catch (e) {
      console.log (e);
    }
  }

  const createLocation = async (location: CreateLocationParams) => {
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

  const deleteLocation = async (id: string) => {
    const unfreeze = freeze ();
    try {
       await fetch (`${api}/locations/${id}`, {
         method: 'delete',
         headers: user.headers.get
       });
    } catch (e) {
      console.log (e);
    } finally {
      unfreeze ();
    }
  }

  useEffect (() => {
    if (user.isAuthenticated && user.headers.get["x-amz-access-token"]) getLocations ();
  }, [user.isAuthenticated, user.headers.get["x-amz-access-token"]]);

  return {
    locations,
    getLocations,
    createLocation,
    deleteLocation
  }
}