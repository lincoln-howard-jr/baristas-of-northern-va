import ChatPage from "../pages/chat/ChatPage";
import NewChatPage from "../pages/chat/NewChatPage";
import SingleChatPage from "../pages/chat/SingleChatPage";

export default function ChatGroup () {
  return (
    <>
      <ChatPage />
      <SingleChatPage />
      <NewChatPage />
    </>
  )
}