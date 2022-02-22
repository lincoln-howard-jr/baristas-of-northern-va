import { createContext, useCallback, useContext, useEffect, useState } from "react";
import useChat, { ChatHook, mockUseChat } from "./hooks/useChat";
import useEvent, { EventHook, mockUseEvent } from "./hooks/useEvents";
import useForum, { ForumHook, mockUseForum } from "./hooks/useForum";
import useInvites, { InvitesHook, mockUseInvite } from "./hooks/useInvites";
import useLocation, { LocationHook, mockUseLocation } from "./hooks/useLocation";
import useMembers, { MembersHook, mockUseMember } from "./hooks/useMembers";
import useRouter, { mockUseRouter, RouterHook } from "./hooks/useRouter";
import useUpload, { mockUseUpload, UploadHook } from "./hooks/useUpload";
import useUser, { UserHook, mockUseUser } from "./hooks/useUser";
interface AppProviderProps {
  children: JSX.Element
}

export interface FreezeFn {
  (): () => void;
}

interface AlertAction {
  name: string,
  onAction: () => void
}
export interface AlertFn {
  (type: 'error' | 'warning' | 'info', text: string, header?: string | undefined, actions?: AlertAction[], delay?: number): void;
}

interface ContextValue {
  freeze: FreezeFn;
  alert: AlertFn;
  user: UserHook;
  members: MembersHook;
  invites: InvitesHook;
  forum: ForumHook;
  location: LocationHook;
  event: EventHook;
  chat: ChatHook;
  uploads: UploadHook;
  router: RouterHook;
}

const defaultValue:ContextValue = {
  freeze: ()=>()=>{},
  alert: () => {},
  user: mockUseUser,
  members: mockUseMember,
  invites: mockUseInvite,
  forum: mockUseForum,
  location: mockUseLocation,
  event: mockUseEvent,
  chat: mockUseChat,
  uploads: mockUseUpload,
  router: mockUseRouter
}

// react context api
const AppContext = createContext<ContextValue> (defaultValue);
export const useApp = () => useContext (AppContext);

export default function AppProvider (props: AppProviderProps) {
  
  // create an alert
  const [alertOpen, setAlertOpen] = useState<'open' | 'closed'> ('closed');
  const [alertType, setAlertType] = useState<'error' | 'warning' | 'info' | ''> ('');
  const [alertText, setAlertText] = useState<string> ('');
  const [alertHeader, setAlertHeader] = useState<string | undefined> (undefined);
  const [alertActions, setAlertActions] = useState<AlertAction[]> ([]);
  // alert close method
  const closeAlert = useCallback (() => {
    setAlertOpen ('closed');
    window.removeEventListener ('click', closeAlert)
  }, [])
  // method to put on 
  const _alert:AlertFn = (type: 'error' | 'warning' | 'info', text: string, header:string | undefined, actions: AlertAction[]=[], delay:number=10) => {
    setTimeout (() => closeAlert (), delay * 1000);
    setAlertType (type);
    setAlertText (text);
    setAlertHeader (header);
    setAlertActions (actions);
    setAlertOpen ('open');
  }
  useEffect (() => {
    if (alertOpen === 'open') window.addEventListener ('click', closeAlert)
  }, [alertOpen, closeAlert]);

  // freeze/unfreeze method
  const [frozen, setFrozen] = useState<string> ('none');
  const freeze = () => {
    setFrozen ('frozen')

    return function unfreeze () {
      setFrozen ('none');
    }
  }

  // hooks
  const router = useRouter ();
  const user = useUser (router, _alert);
  const members = useMembers (freeze, _alert, user);
  const invites = useInvites (user, freeze, _alert);
  const forum = useForum (user, members, _alert, freeze);
  const chat = useChat (user, _alert, members);
  const location = useLocation (user, freeze);
  const event = useEvent (user, freeze);
  const uploads = useUpload (user, freeze, _alert);

  const value:ContextValue = {
    freeze,
    alert: _alert,
    user,
    members,
    invites,
    forum,
    location,
    event,
    chat,
    uploads,
    router
  }

  return (
    <AppContext.Provider value={value}>
      <div className={`alert alert-${alertOpen} ${alertType}`}>
        <p>
          {
            alertHeader &&
            <>
              <span className="header">
                {alertHeader}
              </span>
              <br />
            </>
          }
          {alertText}
          {
            alertActions.length > 0 &&
            <>
              <br />
              {
                alertActions.map (action => (
                  <span className="alert-action" onClick={action.onAction}>{action.name}</span>
                ))
              }
            </>
          }
        </p>
      </div>
      <div className={`freeze ${frozen}`} />
      {props.children}
    </AppContext.Provider>
  )
  
}