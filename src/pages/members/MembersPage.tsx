import { useState } from "react";
import { useApp } from "../../AppProvider";
import BackButton from "../../components/BackButton";
import MemberSearchBar from "../../components/MemberSearchBar";
import SingleMemberProfile from "../../components/SingleMemberProfile";
import Member from "../../types/Member";

export default function MembersPage () {
  const app = useApp ()

  // for member preview
  const [preview, setPreview] = useState<Member | undefined> (undefined);

  if (app.user.isAuthenticated && app.router.is ('/members','exact')) return (
    <main className="member-container">
      <header>
        <BackButton />
        <h1>Member Directory</h1>
      </header>
      <div className="pint-size">
        <p>
          Looking for your own profile, <a onClick={() => app.router.redirect ('/me')}>click here!</a>
        </p>
        <MemberSearchBar active maxResults={5} onClick={m => app.router.redirect (`/members?id=${m.id}`)} emptySearchBehaviour="show"  />
      </div>

      <div className="big-boi">
        <p>
          Looking for your own profile, <a onClick={() => app.router.redirect ('/me')}>click here!</a>
        </p>
        <MemberSearchBar active maxResults={7} onClick={setPreview} emptySearchBehaviour="show" filter={m => m.id !== preview?.id} />
      </div>
      <div className="big-boi member-preview single-member">
        {
          !preview &&
            <p>
              <h2>Member Profiles</h2>
              Click on a member to see more!
            </p>
        }
        {
          !!preview &&
          <SingleMemberProfile {...preview} />
        }
      </div>
    </main>
  )
  return null;
}