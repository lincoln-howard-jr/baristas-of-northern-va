import { AlertFn, FreezeFn } from "../AppProvider";
import api from "../lib/api";
import { UserHook } from "./useUser";

export interface UploadHook {
  createUpload: (file: File, opts: {gallery?: string}) => Promise<any>;
  removeUpload: (id: string) => void;
}

export const mockUseUpload:UploadHook = {
  createUpload: () => new Promise<any> (r => r ('')),
  removeUpload: () => {}
}

export default function useUpload (user: UserHook, freeze: FreezeFn, alert: AlertFn):UploadHook {
  
  const createUpload = (file: File, opts: {gallery?: string}={}) => new Promise<string> (async (resolve, reject) => {
    let unfreeze = freeze ();
    try {
      let req = await fetch (`${api}/uploads`, {
        method: 'post',
        headers: user.headers.post,
        body: JSON.stringify ({
          filename: file.name,
          contentType: file.type,
          ...opts
        })
      })
      let obj = await req.json ();
      await fetch (obj.uploadUrl, {
        method: 'PUT',
        body: file
      })
      resolve (obj)
    } catch (e) {
      console.log (e);
      reject (e);
    } finally {
      unfreeze ();
    }
  })
  
  const removeUpload = async (id: string) => {
    let unfreeze = freeze ();
    try {
      await fetch (`${api}/uploads/${id}`, {
        method: 'delete',
        headers: user.headers.get
      })
      alert ('info', 'Upload with successfully removed');
    } catch (e: any) {
      alert ('error', `${e}`);
    } finally {
      unfreeze ();
    }
  }

  return {
    createUpload,
    removeUpload
  };
}