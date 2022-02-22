import { useEffect, useState } from "react";
import { useApp } from "../../AppProvider";
import BackButton from "../../components/BackButton";
import ListControls from "../../components/ListControls";
import LocationSearchBar from "../../components/LocationSearchBar";
import Upload from "../../components/Upload";
import { cup } from "../../img";
import { formatStrippedPhoneNumber, stripPhoneNumber } from "../../lib/sanitizePhoneNumber";
import Invite from "../../types/Invite";
import Location from "../../types/Location";

const roles = ['barista', 'supervisor', 'manager', 'admin', 'superuser'];

export default function CreateInvitePage () {
  const app = useApp ();

  // all the state management
  const [memberRole, setRole] = useState<string> ('barista');
  const [memberName, setName] = useState<string> ('');
  const [memberEmail, setEmail] = useState<string> ('');
  const [memberPhone, setPhone] = useState<string> ('');
  const [memberLocation, setLocation] = useState<string> ('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null> (null);
  
  // overaching form stuff
  const [invite, setInvite] = useState<Invite> ({
    memberName,
    memberEmail,
    memberLocation,
    memberRole,
    memberPhone
  })
  const [disabled, setDisabled] = useState<boolean> (true);
  useEffect (() => {
    setInvite ({
      memberName,
      memberEmail,
      memberLocation,
      memberRole,
      memberPhone
    });
    setDisabled (
      memberName.length === 0 ||
      memberEmail.length === 0 ||
      memberLocation.length === 0 ||
      memberPhone.length === 0
    )
  }, [memberPhone, memberEmail, memberName, memberRole, memberLocation])

  // method to select a location in the search
  const selectLocation = (location: Location | null) => {
    setLocation (location?.id || '');
    setSelectedLocation (location);
  } 

  // method to finish the form and clean up
  const createInvite = async () => {
    if (disabled) return;
    try {
      await app.invites.createInvite (invite);
      app.alert ('info', `New invite for ${memberName} created!`)
      setName ('');
      setRole ('');
      setEmail ('');
      setPhone ('');
      setLocation ('');
      setSelectedLocation (null);
      setStep (0);
      app.router.redirect ('/invites');
    } catch (e) {
      app.alert ('error', 'Unable to create invite, please try again and contact an administrator if this is a continued issue.')
    }
  }

  const [currentStep, setStep] = useState<number> (0);
  const inviteSteps = [
    (
      <>
        <header>
          <h2>Basic Info</h2>
        </header>
        <section className="form-group">
          <label>Name</label>
          <input value={memberName} onChange={e => setName (e.target.value)} placeholder="..." />
        </section>
        <section className="form-group">
          <label>Email</label>
          <input value={memberEmail} onChange={e => setEmail (e.target.value)} placeholder="..." />
        </section>
        <section className="form-group">
          <label>Phone</label>
          <input value={formatStrippedPhoneNumber (memberPhone)} onChange={e => setPhone (stripPhoneNumber (e.target.value))} placeholder="..." />
        </section>
      </>
    ),
    (
      <>
        <header>
          <h2>Position</h2>
        </header>
        <section className="form-group">
          <label>
            The invitee is a...
            <label className="radio-button">
              <input type="radio" checked={memberRole === 'barista'} onChange={e => e.target.checked && setRole ('barista')} />
              Barista
            </label>
            <label className="radio-button">
              <input type="radio" checked={memberRole === 'supervisor'} onChange={e => e.target.checked && setRole ('supervisor')} />
              Supervisor
            </label>
            <label className="radio-button">
              <input type="radio" checked={memberRole === 'store manager'} onChange={e => e.target.checked && setRole ('store manager')} />
              Store Manager/General Manager
            </label>
            {
              app.user.role === 'superuser' &&
              <>
                <label className="radio-button">
                  <input type="radio" checked={memberRole === 'admin'} onChange={e => e.target.checked && setRole ('admin')} />
                  Admin
                </label>
                <label className="radio-button">
                  <input type="radio" checked={memberRole === 'superuser'} onChange={e => e.target.checked && setRole ('superuser')} />
                  Superuser
                </label>
              </>
            }
          </label>
        </section>
      </>
    ),
    (
      <>
        <header>
          <h2>Location</h2>
        </header>
        {
          selectedLocation !== null &&
          <section className="form-group">
            <div className="locations-container">
              <div className="location">
              {
                selectedLocation.coverPhoto &&
                <Upload {...selectedLocation.coverPhoto} />
              }
              {
                !selectedLocation.coverPhoto &&
                <img src={cup} />
              }
                <h4>{selectedLocation.name}</h4>
              </div>
            </div>
            <p>If this is not the correct location,<a onClick={() => selectLocation (null)}>click here!</a></p>
          </section>
        }
        {
          selectedLocation === null &&
          <LocationSearchBar autofocus emptySearchBehaviour="hide" active={true} maxResults={5} onClick={selectLocation}/>
        }
      </>
    ),
    (
      <>
        <div>
          <h2>Review</h2>
        </div>
        {
          memberName === '' &&
          <p>- Must fill out invitee name!</p>
        }
        {
          memberEmail === '' &&
          <p>- Must fill out invitee email!</p>
        }
        {
          memberPhone === '' &&
          <p>- Must fill out invitee phone number!</p>
        }
        {
          memberLocation === '' &&
          <p>- Must select invitee location!</p>
        }
        {
          !disabled &&
          <p>
            You are inviting <span className="underline">{memberName}</span>, a <span className="underline">{memberRole}</span> from <span className="underline">{selectedLocation?.name}</span> to join the Baristas of Nothern Virginia.
            The invitee will be contacted through the information you provided.
            I, {app.user.name}, a {app.user.role}, certify that this information is correct and understand the significance of this invite.
          </p>
        }
        <div>
          <button disabled={disabled} onClick={createInvite}>Invite {memberName}</button>
        </div>
      </>
    ),
  ]


  if (app.user.isAuthenticated && app.router.is ('/create-invite')) return (
    <main className="create-invite-container">
      <header>
        <BackButton />
        <h1>Invite a Barista</h1>
      </header>
      <div className="pint-size">
        {inviteSteps [currentStep]}
        <ListControls shouldShow countPerPage={1} onChange={setStep} list={inviteSteps} />
      </div>
      <div className="big-boi">
        {inviteSteps [currentStep]}
        <ListControls shouldShow countPerPage={1} onChange={setStep} list={inviteSteps.slice (0, 3)} />
      </div>
      <div className="big-boi">
        {inviteSteps [3]}
      </div>
    </main>
  )
  return null;
}