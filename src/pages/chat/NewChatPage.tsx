import { useApp } from "../../AppProvider";
import BackButton from "../../components/BackButton";
import MemberSearchBar from "../../components/MemberSearchBar";

export default function NewChatPage () {
  const app = useApp ();
  if (!app.user.isAuthenticated || !app.router.is ('/new-chat')) return null;
  return (
    <main>
      <header>
        <BackButton />
        <h1>Chat With...</h1>
      </header>
      <p>Search for a member to chat with!</p>
      <MemberSearchBar active autofocus maxResults={5} emptySearchBehaviour="hide" onClick={m => {app.router.redirect (`/chat?id=${m.id}`)}}/>
    </main>
  )
}