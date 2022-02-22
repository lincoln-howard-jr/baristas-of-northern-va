import { Reducer, useEffect, useReducer, useRef, useState } from "react";
import { useApp } from "../../AppProvider";
import ArrayEditor from "../../components/ArrayEditor";
import BackButton from "../../components/BackButton";
import Upload from "../../components/Upload";
import Member, { EmploymentStatusOptions, MemberUpdate } from "../../types/Member";

const updateReducer = (state: MemberUpdate, action: MemberUpdate | null) => {
  if (action === null) return {};
  const update = {...state, ...action};
  return update;
}

export default function AdminEditMember () {
  const app = useApp ();

  // get the editable member
  const [member, setMember] = useState<Member | undefined> (undefined);
  useEffect (() => {
    if (app.user.isAuthenticated && (app.user.role === 'admin' || app.user.role === 'superuser') && app.router.is ('/admin-edit-member?id=', 'starts with')) {
      const m = app.members.findById (app.router.qsp.get ('id') || '')
      setMember (m);
      runUpdate (null);
    }
  }, [app.router.page, app.user.isAuthenticated, app.members.members])

  // editing stuff
  const [update, runUpdate] = useReducer<Reducer<MemberUpdate,MemberUpdate | null>> (updateReducer, {});

  // profile photo stuff
  const [profilePhotoLink, setProfilePhotoLink] = useState<string | null> (null);
  const profilePhotoInputRef = useRef<HTMLInputElement> (null);
  const clickProfilePhotoInput = () => {
    profilePhotoInputRef.current?.click ();
  }
  const uploadProfilePhoto = async (e: any) => {
    let file = e.target.files [0] as File;
    let obj = await app.uploads.createUpload (file, {});
    runUpdate ({profilePicture: obj.id});
    setProfilePhotoLink (obj.imageUrl as string);
  }

  // cover photo stuff
  const [coverPhotoLink, setCoverPhotoLink] = useState<string | null> (null);
  const coverPhotoInputRef = useRef<HTMLInputElement> (null);
  const clickCoverPhotoInput = () => {
    coverPhotoInputRef.current?.click ();
  }
  const uploadCoverPhoto = async (e: any) => {
    let file = e.target.files [0] as File;
    let obj = await app.uploads.createUpload (file, {});
    runUpdate ({coverPhoto: obj.id});
    setCoverPhotoLink (obj.imageUrl as string);
  }

  if (!app.user.isAuthenticated || (app.user.role !== 'admin' && app.user.role !== 'superuser') || !app.router.is ('/admin-edit-member?id=', 'starts with')) return null;
  return (
    <main>
      <header>
        <BackButton />
        <h1>Edit Profile</h1>
      </header>
      <div>
        <h2>{member?.memberName || 'Member Not Found...'}</h2>
      </div>
      {
        member &&
        <>
          <div>
            <h2>Cover Photo:</h2>
            {
              !coverPhotoLink && member.coverPhoto &&
              <Upload {...member.coverPhoto} />
            }
            {
              coverPhotoLink &&
              <img src={coverPhotoLink} />
            }
            <a onClick={clickCoverPhotoInput}>Click to upload a new cover photo!</a>
            <input ref={coverPhotoInputRef} onChange={uploadCoverPhoto} hidden type="file" accept="image/*" />
          </div>
          <div>
            <h2>Profile Picture:</h2>
            {
              !profilePhotoLink && member.profilePicture &&
              <Upload {...member.profilePicture} />
            }
            {
              profilePhotoLink &&
              <img src={profilePhotoLink} />
            }
            <a onClick={clickProfilePhotoInput}>Click to upload a new profile picture!</a>
            <input ref={profilePhotoInputRef} onChange={uploadProfilePhoto} hidden type="file" accept="image/*" />
          </div>
          <div>
            <h2>Bio:</h2>
            <ArrayEditor maxLength={10} value={update.bio || member.bio || []} onChange={bio => runUpdate ({bio})} />
          </div>
          <div>
            <h2>Accomplishments:</h2>
            <ArrayEditor maxLength={10} value={update.accomplishments || member.accomplishments || []} onChange={accomplishments => runUpdate ({accomplishments})} />
          </div>
          <section className="form-group">
            <label>Employment Status:</label>
            <select value={update.employmentStatus || member.employmentStatus} onChange={e => runUpdate ({employmentStatus: e.currentTarget.value as EmploymentStatusOptions})}>
              <option value="full time">Full Time</option>
              <option value="part time">Part Time</option>
              <option value="unemployed">Unemployed</option>
            </select>
          </section>
          <section>
            <label>
              Denied Invite Permissions
              <input checked={update.isNotGrantedInvitePermission === undefined ? member.isNotGrantedInvitePermission : update.isNotGrantedInvitePermission} onChange={e => runUpdate({isNotGrantedInvitePermission: e.target.checked})} type="checkbox" />
            </label>
          </section>
          <div>
            <button onClick={() => {if (member.id) {
              app.members.adminUpdateInfo (update, member.id);
            }}}>Submit Changes</button>
          </div>
        </>
      }
    </main>
  )
}