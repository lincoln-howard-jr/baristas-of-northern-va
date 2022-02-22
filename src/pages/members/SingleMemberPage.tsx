import { useEffect, useState } from "react";
import { useApp } from "../../AppProvider";
import SingleMemberProfile from "../../components/SingleMemberProfile";
import Member from "../../types/Member";

interface RoleDict {
  [x: string]: string
}

const roleDict:RoleDict = {
  barista: 'Barista',
  supervisor: 'Supervisor',
  manager: 'Store Manager',
  admin: 'Novabaristas Administrator',
  superuser: 'Novabaristas Administrator'
}
export default function SingleMemberPage () {
  const app = useApp ();

  const [member, setMember] = useState<Member | undefined> (undefined);

  useEffect (() => {
    if (app.router.is ('/members?id=', 'starts with')) {
      let id = app.router.qsp.get ('id');
      setMember (app.members.members.find (m => m.id === id));
      if (app.members.me?.id === id) {
        setMember (app.members.me);
      }
    }
  }, [app.router.page, app.members.members])

  if (!app.user.isAuthenticated || member === undefined || !app.router.is ('/members?id=', 'starts with')) return null;
  return (
    <main className="single-member">
      <SingleMemberProfile {...member} />
      {
        (app.user.role === 'admin' || app.user.role === 'superuser') &&
        <p>{app.user.name}, your role {app.user.role}. If you see anything sus, just <a onClick={() => app.router.redirect (`/admin-edit-member?id=${member.id}`)}>click here</a> to edit it.</p>
      }
    </main>
  )
}