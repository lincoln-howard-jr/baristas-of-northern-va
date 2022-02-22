import { useEffect, useRef, useState } from "react";
import { useApp } from "../../AppProvider";
import BackButton from "../../components/BackButton";
import DeleteButton from "../../components/DeleteButton";
import SinglePost from "../../components/Post";
import { send } from "../../img";
import Post from "../../types/Post";

export default function ThreadPage () {
  const app = useApp ();

  const contentRef = useRef<HTMLParagraphElement> (null);
  const onEnter = () => {
    if (contentRef.current && contentRef.current.innerText.length > 0 && thread) {
      app.forum.createPost (contentRef.current.innerText, thread.id);
      contentRef.current.innerText = '';
    }
  }

  const [thread, setThread] = useState<Post | undefined> (undefined);
  const [parents, setParents] = useState<Post[]> ([]);
  useEffect (() => {
    if (app.router.qsp.has ('id')) {
      const id = app.router.qsp.get ('id');
      setThread (app.forum.posts.find (p => p.id === id));
    }
  }, [app.router.page, app.forum.posts, app.router.qsp])

  useEffect (() => {
    let arr:Post[] = [];
    let parent = thread?.parent;
    while (parent) {
      const found = app.forum.posts.find (p => p.id === parent);
      if (found) arr = [found, ...arr];
      parent = found?.parent;
    }
    setParents (arr);
  }, [thread, app.forum.posts]);

  if (!app.user.isAuthenticated || !app.router.is ('/threads?id=', 'starts with') || !thread) return null;
  return (
    <main>
      <header>
        <BackButton />
        <h1>Forum</h1>
        <DeleteButton onDelete={() => app.forum.deletePost (thread.id || '')} alertText={`Delete this thread from ${thread.member.memberName}.`} />
      </header>
      <div className="pint-size thread-container">
        {
          parents.map (post => (
            <SinglePost post={post} collapsed />
          ))
        }
        <SinglePost post={thread} hideCommentCount />
        <div>
          <h2>Reply</h2>
          <p ref={contentRef} contentEditable />
          <button onClick={onEnter}><img src={send} alt="" /> Send</button>
        </div> 
      </div>
      
      <div className="big-boi">
        <div className="thread-container">
          {
            parents.map (post => (
              <SinglePost post={post} collapsed />
            ))
          }
          <SinglePost post={thread} hideCommentCount />
        </div>
        <div>
          <h2>Reply</h2>
          <p ref={contentRef} contentEditable />
          <button onClick={onEnter}><img src={send} alt="" /> Send</button>
        </div> 
      </div>
      <div>
        <h2>Comments ({app.forum.posts.filter (p => p.parent === thread.id).length})</h2>
        {
          app.forum.posts.filter (p => p.parent === thread.id).map (post => (
            <SinglePost post={post} clickable />
          ))
        }
      </div>
    </main>
  )
}