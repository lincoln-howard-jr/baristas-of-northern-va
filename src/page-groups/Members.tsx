import AdminEditMember from "../pages/members/AdminEditMember";
import EditMemberProfile from "../pages/members/EditMemberProfile";
import MembersPage from "../pages/members/MembersPage";
import SingleMemberPage from "../pages/members/SingleMemberPage";

export default function MembersGroup () {
  return (
    <>
      <AdminEditMember />
      <EditMemberProfile />
      <MembersPage />
      <SingleMemberPage />
    </>
  )
}