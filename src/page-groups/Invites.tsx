import CreateInvitePage from "../pages/invites/CreateInvitePage";
import CreateUser from "../pages/invites/CreateUser";
import InvitesPage from "../pages/invites/InvitesPage";
import SingleOpenInvitePage from "../pages/invites/SingleOpenInvite";

export default function InvitesGroup () {
  return (
    <>
      <CreateUser />
      <InvitesPage />
      <CreateInvitePage />
      <SingleOpenInvitePage />
    </>
  )
}