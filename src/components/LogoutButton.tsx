import { useApp } from "../AppProvider";
import { logout } from "../img";
export default function LogoutButton () {
  const app = useApp ();

  const actions = [
    {
      name: 'Yes, Sign Out',
      onAction: () => app.user.signOut ()
    }
  ]

  const onclick = () => {
    app.alert ('warning', `Hey ${app.user.name.split (' ') [0]}, are you sure you want to sign out?`, undefined, actions)
  }
    
  if (!app.user.isAuthenticated) return null;
  return (
    <span className="clickable-action logout-button" onClick={onclick}>
      <img src={logout} alt="" />
    </span>
  )
}