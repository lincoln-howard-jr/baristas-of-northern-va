import { useEffect, useState } from "react"
import { AlertFn, FreezeFn } from "../AppProvider";
import api from "../lib/api";
import Member from "../types/Member";
import Post from "../types/Post";
import { MembersHook } from "./useMembers";
import { UserHook } from "./useUser";

export interface ForumHook {
  rawPosts?: any[];
  posts: Post[];
  createPost: (content: string, parent?: string) => void;
  deletePost: (id: string) => void;
}
export const mockUseForum:ForumHook = {
  posts: [],
  createPost: () => {},
  deletePost: () => {}
}
export default function useForum (user: UserHook, members: MembersHook, alert: AlertFn, freeze: FreezeFn):ForumHook {

  const [rawPosts, setRawPosts] = useState<any[]> ([]);
  const [posts, setPosts] = useState<Post[]> ([]);
  
  const getPosts = async () => {
    try {
      const req = await fetch (`${api}/posts`, {
        headers: user.headers.get
      });
      const data:any[] = await req.json ();
      setRawPosts (data);
      const transformed = data.map<Post> (data => {
        const obj:Post = {
          id: data.id as string,
          content: data.content as string,
          createdAt: new Date (data.createdAt * 1000),
          member: members.findById (data.member) as Member,
          parent: data.parent
        }
        return obj;
      })
      console.log (data, transformed)
      setPosts (transformed);
    } catch (e) {
      alert ('error', 'Could not retrieve forum posts');
    }
  }

  const createPost = async (content: string, parent?: string) => {
    const unfreeze = freeze ();
    try {
      await fetch (`${api}/posts${parent ? '/' + parent : ''}`, {
        method: 'post',
        headers: user.headers.post,
        body: JSON.stringify ({content})
      });
      getPosts ();
      alert ('info', 'Your post is shared!');
    } catch (e) {
      alert ('error', `${e}`);
    } finally {
      unfreeze ();
    }
  }

  const deletePost = async (id: string) => {
    const unfreeze = freeze ();
    try {
       await fetch (`${api}/posts/${id}`, {
         method: 'delete',
         headers: user.headers.get
       });
       getPosts ();
    } catch (e) {
      alert ('error', `${e}`);
    } finally {
      unfreeze ();
    }
  }
  useEffect (() => {
    if (user.isAuthenticated && user.headers.get["x-amz-access-token"] && members.members.length > 0) getPosts ();
  }, [user.isAuthenticated, user.headers.get["x-amz-access-token"], members.members])

  return {
    rawPosts,
    posts,
    createPost,
    deletePost
  }
}