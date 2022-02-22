import { useApp } from "../../AppProvider";
import BackButton from "../../components/BackButton";
import MemberSearchBar from "../../components/MemberSearchBar";

function calcTimeLeft (validUntil: number) {
  const diff = (validUntil) - (Date.now () / 1000);
  if (diff <= 0) return 'This invite has expired'
  const hours = Math.floor (diff / 3600);
  return `${hours} hours left before this invite expires`
}

export default function InvitesPage () {
  const app = useApp ();

  if (app.user.isAuthenticated && app.router.is ('/invites', 'exact')) return (
    <main>
      <header>
        <BackButton />
        <h1>Your Invites</h1>
      </header>
      <div>
        <h2>Open Invites</h2>
      </div>
      {
        app.invites.openInvites.length === 0 &&
        <p>
          You have no outstanding invites at this time! 
          {
            app.members.invitedByMe.length > 0 &&
            <>
              <a onClick={() => app.router.redirect ('/create-invite')}> Click here</a> to invite another member!
            </>
          }
        </p>
      }
      {
        app.invites.openInvites.map (invite => (
          <div>
            {invite.memberName} - {invite.validUntil && calcTimeLeft (invite.validUntil)}
            <button onClick={() => app.router.redirect (`/open-invites?id=${invite.id}`)}>View Invite</button>
          </div>
        ))
      }
      <div>
        <h2>Accepted Invites</h2>
      </div>
      {
        app.members.invitedByMe.length === 0 &&
        <p>
          You haven't invited anyone quite yet! <a onClick={() => app.router.redirect ('/create-invite')}>Click here</a> to invite someone new!
        </p>
      }
      {
        app.members.invitedByMe.length > 0 &&
        <MemberSearchBar active emptySearchBehaviour="show" maxResults={5} onClick={m => app.router.redirect (`/members?id=${m.id}`)} filter={m => m.invitedBy?.id === app.members.me?.id} /> 
      }
      {
        app.members.invitedByMe.length > 0 && app.invites.openInvites.length > 0 &&
        <div>
          <button onClick={() => app.router.redirect ('/create-invite')}>Create Invite</button>
        </div>
      }
    </main>
  )
  return null;
}