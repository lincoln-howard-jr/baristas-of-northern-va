import { useEffect, useState } from "react";
import QRCode from 'react-qr-code';
import { useApp } from "../../AppProvider";
import BackButton from "../../components/BackButton";
import { printDateTime } from "../../lib/formatDate";
import { formatStrippedPhoneNumber } from "../../lib/sanitizePhoneNumber";
import Invite from "../../types/Invite";

export default function SingleOpenInvitePage () {
  const app = useApp ();
  const [invite, setInvite] = useState<Invite | undefined> (undefined);
  useEffect (() => {
    if (app.router.is ('/open-invites?id=', 'starts with')) {
      const id = app.router.qsp.get ('id');
      setInvite (app.invites.openInvites.find (i => i.id === id));
    } else {
      setInvite (undefined);
    }
  }, [app.router.page, app.invites.openInvites, app.router.qsp])

  if (!app.user.isAuthenticated || !app.router.is ('/open-invites?id=', 'starts with') || !invite) return null;
  return (
    <main>
      <header>
        <BackButton />
        <h1>Open Invite for {invite.memberName}</h1>
      </header>
      <p className="grid text-center">
        <h3>Name:</h3>
        {invite.memberName}
        <h3>Email:</h3>
        {invite.memberEmail}
        <h3>Phone:</h3>
        {formatStrippedPhoneNumber (invite.memberPhone)}
        <h3>Valid Until:</h3>
        {invite.validUntil && printDateTime (invite.validUntil)}
      </p>
      <div className="grid justify-center">
        <QRCode value={`https://novabaristas.com/invites?id=${invite.id}`} />
      </div>
    </main>
  )
}