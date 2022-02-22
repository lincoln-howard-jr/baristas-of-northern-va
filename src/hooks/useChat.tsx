import { useEffect, useState } from "react"
import { AlertFn } from "../AppProvider";
import api from "../lib/api";
import Member from "../types/Member";
import Message, { RawMessage } from "../types/Message";
import { MembersHook } from "./useMembers";
import { UserHook } from "./useUser";

interface WebSocketActions {
  [x: string]: (data:any) => void;
}

interface GetMessageResponse {
  to: RawMessage[];
  from: RawMessage[];
}

export interface ChatHook {
  isAuthenticated: boolean;
  websocket: WebSocket | null;
  messages: Message[];
  sendMessage: (to: Member, message: string) => void;
}
export const mockUseChat:ChatHook = {
  isAuthenticated: false,
  websocket: null,
  messages: [],
  sendMessage: () => {}
}
export default function useChat (user: UserHook, alert: AlertFn, members: MembersHook):ChatHook {
  // global state for websockets
  const [isAuthenticated, setWsAuthenticated] = useState<boolean> (false);
  const [websocket, setWebsocket] = useState<WebSocket | null> (null);
  const [messages, setMessages] = useState<Message[]> ([]);

  // hidden state, we will use this for when we push a message
  const [sentMessage, setSentMessage] = useState<Message | null> (null);
  const [success, setSuccess] = useState<boolean> (false);
  const [recievedMessage, setRecievedMessage] = useState<Message | null> (null);

  useEffect (() => {
    if (success && sentMessage) {
      setMessages ([...messages, sentMessage]);
      setSentMessage (null);
      setSuccess (false);
    }
  }, [success, sentMessage])

  useEffect (() => {
    if (recievedMessage) {
      setMessages ([...messages, recievedMessage]);
      setRecievedMessage (null);
    }
  }, [recievedMessage])

  // get messages and format how we like it
  const getMessages = async () => {
    try {
      const req = await fetch (`${api}/messages`, {
        headers: user.headers.get
      });
      const {to, from} = await req.json () as GetMessageResponse;
      const allraw:RawMessage[] = [...to, ...from];
      allraw.sort ((a, b) => a.createdAt - b.createdAt);
      let all = allraw.map<Message> (raw => ({
        isFromMe: raw.fromMember === members.me?.id,
        otherMember: raw.fromMember === members.me?.id ? members.findById (raw.toMember) : members.findById (raw.fromMember),
        message: raw.message,
        createdAt: new Date (raw.createdAt * 1000)
      }))
      setMessages (all);
    } catch (e) {
      alert ('error', 'Error while retrieving messages!')
    }
  }

  // sends a message
  const sendMessage = (to: Member, message: string) => {
    if (!isAuthenticated) return;
    if (websocket) websocket.send (JSON.stringify ({to: to.id, message}));
    setSentMessage ({
      otherMember: to,
      isFromMe: true,
      message,
      createdAt: new Date ()
    })
  }

  function onOpen () {
    if (websocket) websocket.send (user.headers.get["x-amz-access-token"] as string);
  }

  const actions:WebSocketActions = {
    authorize: data => {
      setWsAuthenticated (data.success);
      if (!data.success)
        alert ('warning', 'Could not connect to chat the live chat :(');
    },
    ['send-message']: data => {
      setSuccess (data.success);
    },
    ['recieve-message']: data => {
      let otherMember = members.findById (data.from);
      setRecievedMessage ({
        isFromMe: false,
        otherMember,
        message: data.message,
        createdAt: new Date ()
      });
    }
  }

  function onMessage (e: any) {
    let data = JSON.parse (e.data);
    if (data.action in actions) actions [data.action] (data);
  }

  useEffect (() => {
    if (user.isAuthenticated && user.headers.get["x-amz-access-token"] && members.members.length) {
      getMessages ()
      const ws = new WebSocket ('wss://opfrivk32f.execute-api.us-east-1.amazonaws.com/production');
      setWebsocket (ws);
    }
  }, [user.isAuthenticated, user.headers.get["x-amz-access-token"], members.members.length])

  useEffect (() => {
    if (websocket) {
      websocket.addEventListener ('open', onOpen)
      websocket.addEventListener ('message', onMessage)
    }
  }, [websocket])

  return {
    isAuthenticated,
    websocket,
    messages,
    sendMessage
  }
}