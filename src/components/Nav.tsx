import React, { useEffect, useRef, useState } from "react"
import { useApp } from "../AppProvider";
import { navigation } from "../img";

export default function Nav () {
  const app = useApp ();

  const [open, setOpen] = useState<boolean> (false);
  const backdropRef = useRef<HTMLElement> (null);

  const click = (e: React.MouseEvent<HTMLElement>) => {
    if (backdropRef.current === e.target) setOpen (false);
  }

  // redirect and close
  const rac = (path: string) => () => {
    app.router.redirect (path);
    setOpen (false);
  }

  const [startX, setStartX] = useState<number> (-1);
  const [startY, setStartY] = useState<number> (-1);
  const [endX, setEndX] = useState<number> (-1);
  const [endY, setEndY] = useState<number> (-1);
  
  const touchStart = (e: TouchEvent) => {
    setEndX (-1);
    setEndY (-1);
    setStartX (e.changedTouches [0].screenX);
    setStartY (e.changedTouches [0].screenY);
  }
  const touchEnd = (e: TouchEvent) => {
    setEndX (e.changedTouches [0].screenX);
    setEndY (e.changedTouches [0].screenY);
  }

  useEffect (() => {
    window.addEventListener ('touchstart', touchStart);
    window.addEventListener ('touchend', touchEnd);
  }, [])

  useEffect (() => {
    if (startX === -1 || startY === -1 || endX === -1 || endY === -1) return;
    if (endX - startX > 35 && Math.abs (endY - startY) < 15) {
      setOpen (true);
      setStartX (-1);
      setStartY (-1);
      setEndX (-1);
      setEndY (-1);
    }
  }, [startX, startY, endX, endY]);

  if (app.user.isAuthenticated) return (
    <>
      <nav onClick={click} ref={backdropRef} className={`nav ${open ? 'open' : 'closed'}`}>
        <ul>
          <li onClick={rac ('/')}>Dashboard</li>
          <li onClick={rac ('/forum')}>Forum</li>
          <li onClick={rac ('/locations')}>Locations</li>
          <li onClick={rac ('/members')}>Members</li>
          <li onClick={rac ('/chat')}>Chat</li>
        </ul>
      </nav>
      <a onClick={() => setOpen (true)} className={`nav-button ${open ? 'open' : 'closed'}`}>
        <img src={navigation} />
      </a>
    </>
  );
  return null;
}