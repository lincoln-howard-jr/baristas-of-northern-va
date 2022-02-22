import { useState } from "react";
import { useApp } from "../../AppProvider";
import BackButton from "../../components/BackButton";

export default function CreateUser () {
  const app = useApp ();

  const [email, setEmail] = useState<string> ('');

  if (!app.user.isAuthenticated && app.router.is ('/invites?id=', 'starts with') && app.router.qsp.has ('id')) return (
    <main>
      <header>
        <BackButton />
        <h1>Almost Done!</h1>
      </header>
      <p>Just confirm your email and then we can get going!</p>
      <section className="form-group">
        <label>Email</label>
        <input value={email} onChange={e => setEmail (e.target.value)} placeholder="..." />
      </section>
      <div>
        <button onClick={() => app.invites.acceptInvite (app.router.qsp.get ('id') as string, email)}>Done!</button>
      </div>
    </main>
  );
  return null;
}