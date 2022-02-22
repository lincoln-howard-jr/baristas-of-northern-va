import { useState } from "react";
import { useApp } from "../AppProvider";

export default function AuthPage () {
  const app = useApp ();

  const [email, setEmail] = useState<string> ('');
  const [password, setPassword] = useState<string> ('');
  const [verificationCode, setCode] = useState<string> ('');
  const [newPassword, setNewPassword] = useState<string> ('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string> ('');
  
  const [resetPasswordMode, setResetPasswordMode] = useState<boolean> (false);
  const forgotPassword = () => {
    if (!email) return setResetPasswordMode (true);
    app.user.forgotPassword (email);
  }

  const login = async () => {
    await app.user.login (email, password);
  }

  if (app.user.isForgotPassword) return (
    <main className="auth-container">
        <header>
          <h1>Create New Password</h1>
        </header>
        <section>
          <p>
            For security purposes, we need you to create a new password.
            After that we can get you back in the conversation with everyone!
          </p>
        </section>
        <section>
          <label>
            Verification Code
          </label>
          <input type="tel" onChange={e => setCode (e.target.value)} value={verificationCode} placeholder="..." />
        </section>
        <section>
          <label>
            New Password
          </label>
          <input type="password" onChange={e => setNewPassword (e.target.value)} value={newPassword} placeholder="new password" />
        </section>
        <section>
          <label>
            Confirm New Password
          </label>
          <input type="password" onChange={e => setConfirmNewPassword (e.target.value)} value={confirmNewPassword} placeholder="new password" />
        </section>
        <section>
          <button onClick={() => app.user.confirmPassword (verificationCode, newPassword)}>Done</button>
        </section>
    </main>

  )
  if (app.user.isChangePassword) return (
    <main className="auth-container">
        <header>
          <h1>Create New Password</h1>
        </header>
        <section>
          <p>
            For security purposes, we need you to create a new password.
            After that we can get you back in the conversation with everyone!
          </p>
        </section>
        <section>
          <label>
            New Password
          </label>
          <input type="password" onChange={e => setNewPassword (e.target.value)} value={newPassword} placeholder="new password" />
        </section>
        <section>
          <label>
            Confirm New Password
          </label>
          <input type="password" onChange={e => setConfirmNewPassword (e.target.value)} value={confirmNewPassword} placeholder="new password" />
        </section>
        <section>
          <button onClick={() => app.user.completePasswordChallenge (newPassword)}>Done</button>
        </section>
    </main>
  );
  if (resetPasswordMode) return (
    <main className="auth-container">
      <header>
        <h1>Forgot Password</h1>
      </header>
      <section>
        <p>
          To reset your password just provide your email and we'll send you a verification code!
        </p>
      </section>
      <section>
        <label>
          Email:
        </label>
        <input onChange={e => setEmail (e.target.value)} value={email} placeholder="barista@coffeeshop.com" />
      </section>
      <section>
        <button onClick={login}>Reset Password</button>
      </section>
    </main>
  )
  if (!app.user.isAuthenticated && !app.router.is ('/invites?id=', 'starts with')) return (
    <main className="auth-container">
      <header>
        <h1>Log In</h1>
      </header>
      <section>
        <p>
          <h2>About Baristas of Northern Virginia</h2>
        </p>
        <p>
          Baristas of Northern Virginia is an exclusive organization of baristas that work in Northern Virginia.
          We believe that all baristas, regarless of cafe affliation, share a common experience and can join together for the better of all of us.
        </p>
      </section>
      <div>
        <section>
          <label>
            Email:
          </label>
          <input onChange={e => setEmail (e.target.value)} value={email} placeholder="barista@coffeeshop.com" />
        </section>
        <section>
          <label>
            Password:
          </label>
          <input type="password" onChange={e => setPassword (e.target.value)} value={password} placeholder="your super secure password" />
        </section>
        <section>
          <button onClick={login}>Go!</button>
          <br />
          <a onClick={() => forgotPassword ()}>Forgot Password</a>
        </section>
      </div>
    </main>
  );
  return null;
}