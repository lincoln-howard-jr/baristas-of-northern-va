import { useEffect, useState } from "react";
import { useApp } from "../../AppProvider"
import BackButton from "../../components/BackButton";
import ListControls from "../../components/ListControls";
import Upload from "../../components/Upload";
import { beans, chat, search } from "../../img";
import Member from "../../types/Member";
import Message from "../../types/Message";

interface Chat {
  otherMember: Member;
  messages: Message[];
  mostRecentMessage: Date;
}

function chatArrayReducer (acc:Chat[], val:Message):Chat[] {
  let el = acc.find (chat => chat.otherMember.id === val.otherMember?.id);
  if (el) el.messages.push (val);
  if (!el && val.otherMember) acc.push ({
    otherMember: val.otherMember,
    messages: [val],
    mostRecentMessage: val.createdAt
  });
  return acc;
}

function trunc (str: string, chars:number=45) {
  if (str.length > chars - 3)
    return `${str.substring (0, chars - 3)}...`
  return str;
}

export default function ChatPage () {
  const app = useApp ();
  const [searchText, setSearchText] = useState<string> ('');
  const [chatSearchResults, setChatSearchResults] = useState<Chat[]> ([]);
  const [countPerPage, setCountPerPage] = useState<number> (5);
  const [page, setPage] = useState<number> (0);

  useEffect (() => {
    const chats = app.chat.messages.reduce (chatArrayReducer, []);
    setChatSearchResults (chats);
  }, [app.chat.messages]);

  if (!app.user.isAuthenticated || !app.router.is ('/chat')) return null;
  return (
    <main>
      <header>
        <BackButton />
        <h1>Chat</h1>
      </header>
      <div>
        <div className="chat-preview" onClick={() => app.router.redirect ('/new-chat')}>
          <img src={chat} />
          <span className="chat-member-name">Start a Conversation</span>
          <span className="chat-member-message">New ideas are always on the horizon</span>
        </div>
      </div>
      <hr />
      <div>
        {
          !!chatSearchResults.length &&
          <>
            <div>
              <h2>Your Conversations:</h2>
            </div>
            <section className="form-group">
              <label className="search">
                <input autoFocus value={searchText} onChange={e => setSearchText (e.target.value)} placeholder="Search chats" />
                <img src={search} />
              </label>
            </section>
          </>
        }
        {
          chatSearchResults.filter ((_,i) => i >= page * countPerPage && i < (page + 1) * countPerPage).map ((chat) => (
            <div className="chat-preview" onClick={() => app.router.redirect (`/chat?id=${chat.otherMember.id}`)}>
              {
                chat.otherMember.profilePicture &&
                <span className="profile-picture">
                  <Upload {...chat.otherMember.profilePicture} />
                </span>
              }
              {
                !chat.otherMember.profilePicture &&
                <img src={beans} />
              }
              <span className="chat-member-name">{chat.otherMember.memberName}</span>
              <span className="chat-member-message">{trunc (chat.messages [chat.messages.length - 1].message)}</span>
            </div>
          ))
        }
        <ListControls list={chatSearchResults} shouldShow={chatSearchResults.length > countPerPage} countPerPage={countPerPage} onChange={setPage} />
      </div>
    </main>
  )
}