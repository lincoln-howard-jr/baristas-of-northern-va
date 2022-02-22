import { useRef } from "react";
import { useApp } from "../../AppProvider"
import BackButton from "../../components/BackButton";
import SinglePost from "../../components/Post";
import { send } from "../../img";

export default function ForumPage () {
  const app = useApp ();

  const contentRef = useRef<HTMLDivElement> (null);
  const onEnter = () => {
    if (contentRef.current && contentRef.current.innerText.length > 5) {
      app.forum.createPost (contentRef.current.innerText);
      contentRef.current.innerText = '';
    }
  }

  if (!app.user.isAuthenticated || !app.router.is ('/forum')) return null;
  return (
    <main>
      <header>
        <BackButton />
        <h1>Forum</h1>
      </header>
      <div className="pint-size breakout">
        <h2>Join the Conversation</h2>
        {
          app.forum.posts.filter (p => !p.parent).map (post => (
            <SinglePost post={post} clickable />
          ))
        }
      </div>
      <div className="pint-size breakout">
        <div className="breakout">
          <h2>Start a New Thread</h2>
          <div ref={contentRef} className="breakout" onKeyDown={onEnter} contentEditable />
          <button onClick={() => onEnter ()}><img src={send} alt="" /> Send</button>
        </div>
      </div>
      <div className="big-boi">
        {
          app.forum.posts.filter (p => !p.parent).map (post => (
            <SinglePost post={post} clickable />
          ))
        }
      </div>
      <div className="big-boi">
        <p>
          <h2>Start a New Thread</h2>
        </p>
        <div ref={contentRef} contentEditable />
        <button onClick={() => onEnter ()}><img src={send} alt="" /> Send</button>
      </div>
    </main>
  )
}