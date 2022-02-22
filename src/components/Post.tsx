import { useState } from "react";
import { useApp } from "../AppProvider";
import trunc from "../lib/trunc";
import Post from "../types/Post";
import Upload from "./Upload";

interface SinglePostProps {
  post: Post;
  clickable?: boolean;
  collapsed?: boolean;
  hideCommentCount?: boolean;
}

export default function SinglePost (props: SinglePostProps) {
  const app = useApp ();

  const [uncollapsed, setUncollapsed] = useState<boolean> (false);

  const onclick = () => {
    if (!uncollapsed && props.collapsed) return setUncollapsed (true);
    if (uncollapsed && props.collapsed) return setUncollapsed (false);
    if (!props.clickable) return;
    app.router.redirect (`/threads?id=${props.post.id}`)
  }

  return (
    <div onClick={onclick} className={"forum-thread breakout " + (props.clickable || (!uncollapsed && props.collapsed) ? 'clickable' : '')}>
      {
        props.post.member.profilePicture &&
        <figure className="profile-picture">
          <Upload {...props.post.member.profilePicture} />
        </figure>
      }
      <header>
        <h3>{trunc(props.post.member.memberName, 21)}</h3>
        <p>{`${props.post.createdAt.toDateString ()}`}</p>
        {
          !props.hideCommentCount &&
          <h4>{app.forum.posts.filter (p => p.parent === props.post.id).length}</h4>
        }
      </header>
      {
        (uncollapsed || !props.collapsed) &&
        <>
          <div />
          <p>{props.post.content}</p>
        </>
      }
    </div>
  )
}