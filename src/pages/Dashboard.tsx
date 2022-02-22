import { useApp } from "../AppProvider"
import LogoutButton from "../components/LogoutButton";
import { beans, calendar, chat, forum, leadership, pin, search, send } from "../img";

export default function Dashboard () {
  const app = useApp ();

  if (!app.user.isAuthenticated || !app.router.is ('/')) return null;
  return (
    <main className="dashboard">
      <header>
        <h1>Welcome, {app.user.name}!</h1>
        <LogoutButton />
      </header>
      <header>
        <p>
          It's nice to have you here at Baristas of Northern Virginia! We're looking forward to all the great things we will do together!
          Here are a few suggestions of some exicing things to do while you're here!
        </p>
        <div className="breakout dashboard-quick-links">
          <button onClick={() => app.router.redirect ('/create-invite')}>
            <img src={send} />
            Invite Baristas
          </button>
          <button onClick={() => app.router.redirect ('/invites')}>
            <img src={beans} />
            Review Invites
          </button>
          <button onClick={() => app.router.redirect ('/members')}>
            <img src={search} />
            Find Members
          </button>
          <button onClick={() => app.router.redirect ('/locations')}>
            <img src={pin} />
            Our Locations
          </button>
          <button onClick={() => app.router.redirect ('/chat')}>
            <img src={chat} />
            Send Message
          </button>
          <button onClick={() => app.router.redirect ('/forum')}>
            <img src={forum} />
            Member Forum
          </button>
          <button onClick={() => app.router.redirect ('/events')}>
            <img src={calendar} />
            Public Events
          </button>
          <button onClick={() => app.router.redirect ('/create-event')}>
            <img src={leadership} />
            Lead an Event
          </button>
        </div>
      </header>
    </main>
  )
}