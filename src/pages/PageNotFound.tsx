import { useApp } from "../AppProvider";
import BackButton from "../components/BackButton";

export default function PageNotFound () {
  const app = useApp ();
  if (!app.user.isAuthenticated || !app.router.is (null)) return null;
  return (
    <main>
      <header>
        <BackButton />
        <h1>404</h1>
      </header>
      <p>
        I don't know what you were looking for, but there's no coffee here!
      </p>
    </main>
  )
}