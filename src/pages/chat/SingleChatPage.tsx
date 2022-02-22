import { useEffect, useRef, useState } from "react";
import { useApp } from "../../AppProvider";
import BackButton from "../../components/BackButton";
import Upload from "../../components/Upload";
import Member from "../../types/Member";
import Message from "../../types/Message";

export default function SingleChatPage () {
  const app = useApp ()
  const [otherMember, setOtherMember] = useState<Member | undefined> (undefined);
  const [messages, setMessages] = useState<Message[]> ([]);
  const topRef = useRef<HTMLParagraphElement> (null);
  const bottomRef = useRef<HTMLParagraphElement> (null);
  const containerRef = useRef<HTMLDivElement> (null);
  const messageContentRef = useRef<HTMLDivElement> (null);

  const [textCleared, setTextCleared] = useState<boolean> (false);
  const clearText = () => {
    if (textCleared) return;
    setTextCleared (true);
    if (messageContentRef.current?.innerText) messageContentRef.current.innerText = '';
  }
  const sendMessage = () => {
    if (messageContentRef.current?.innerText?.length && otherMember) {
      app.chat.sendMessage (otherMember, messageContentRef.current.innerText);
       messageContentRef.current.innerText = '';
      setTextCleared (false);
    }
  }

  useEffect (() => {
    if (app.router.is ('/chat?id=', 'starts with')) {
      let id = app.router.qsp.get ('id');
      setOtherMember (app.members.findById (id || ''));
      setMessages (app.chat.messages.filter (m => m.otherMember?.id === id));
    }
  }, [app.router.page, app.chat.messages]);

  useEffect (() => {
    if (messages.length) bottomRef.current?.scrollIntoView ({behavior: "smooth"});
  }, [messages]);


  //calculate scrolling
  const [scrollPosition, setScrollPosition] = useState<'' | 'top' | 'middle' | 'bottom'> ('');
  useEffect (() => {
    if (topRef.current && bottomRef.current && containerRef.current) {
      let observer = new IntersectionObserver (entries => {
        console.log (entries);
        let top = entries.find (e => e.target === topRef.current);
        let bottom = entries.find (e => e.target === bottomRef.current);
        if (!top?.isIntersecting && !bottom?.isIntersecting) setScrollPosition ('middle');
        else if (top?.isIntersecting && !bottom?.isIntersecting) setScrollPosition ('top');
        else if (bottom?.isIntersecting && !top?.isIntersecting) setScrollPosition ('bottom');
        else setScrollPosition ('');
      }, {
        root: containerRef.current
      });
      observer.observe (topRef.current);
      observer.observe (bottomRef.current);
    }
  }, [containerRef.current, bottomRef.current, topRef.current])

  if (!app.user.isAuthenticated || !app.router.is ('/chat?id=', 'starts with')) return null;
  return (
    <main className="single-chat">
      <header>
        <BackButton />
        <h1>{otherMember?.memberName}</h1>
      </header>
      <header>
        {
          !!otherMember?.profilePicture &&
          <div className="profile-picture">
            <Upload {...otherMember.profilePicture} />
          </div>
        }
        {
          !messages.length &&
          <p>Go ahead, break the ice! The conversation starts now!</p>
        }
        <div ref={containerRef} className={`breakout message-container ${scrollPosition}`}>
          {
            messages.length > 3 &&
            <>
              <p ref={topRef} className={`breakout message ${messages [0].isFromMe ? 'from' : 'to'}`}>
                <span>
                  {messages [0].message}
                </span>
              </p>
              {
                messages.filter ((_ , i) => i !== 0 && i !== messages.length - 1).map ((message, i) => (
                  <p className={`breakout message ${message.isFromMe ? 'from' : 'to'}`}>
                    <span>
                      {message.message}
                    </span>
                  </p>
                ))
              }
              <p ref={bottomRef} className={`breakout message ${messages [messages.length - 1].isFromMe ? 'from' : 'to'}`}>
                <span>
                  {messages [messages.length - 1].message}
                </span>
              </p>
            </>
          }
          {
            messages.length <= 5 &&
            messages.map ((message) => (
              <p className={`breakout message ${message.isFromMe ? 'from' : 'to'}`}>
                <span>
                  {message.message}
                </span>
              </p>
            ))
          }
        </div>
        <section>
          <div ref={messageContentRef} onClick={() => clearText ()} className="chat-send-message" onKeyDown={e => {
            if (e.key === 'Enter' && otherMember) {
              sendMessage ()
            }
          }} contentEditable>Type your message here</div>
        </section>
        <div className="chat-send-message-button">
          <button onClick={sendMessage}>Send</button>
        </div>
      </header>
    </main>
  )
}