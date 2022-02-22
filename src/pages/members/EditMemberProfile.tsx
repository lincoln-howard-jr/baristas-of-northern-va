import { useEffect, useRef, useState } from "react";
import { useApp } from "../../AppProvider";
import ArrayEditor from "../../components/ArrayEditor";
import BackButton from "../../components/BackButton";
import Upload from "../../components/Upload";
import { EmploymentStatusOptions, MemberUpdate } from "../../types/Member";

export default function EditMemberProfile () {
  const app = useApp ();

  // local state for managing the update object
  const [lock, setLock] = useState<boolean> (true);
  const [update, setUpdate] = useState<MemberUpdate> ({});
  
  // profile photo stuff
  const [profilePhotoLink, setProfilePhotoLink] = useState<string | null> (null);
  const profilePhotoInputRef = useRef<HTMLInputElement> (null);
  const clickProfilePhotoInput = () => {
    profilePhotoInputRef.current?.click ();
  }
  const uploadProfilePhoto = async (e: any) => {
    let file = e.target.files [0] as File;
    let obj = await app.uploads.createUpload (file, {});
    setUpdate ({...update, profilePicture: obj.id});
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
    setUpdate ({...update, coverPhoto: obj.id});
    setCoverPhotoLink (obj.imageUrl as string);
  }

  // the other editable fields
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatusOptions | undefined> (app.members.me?.employmentStatus as EmploymentStatusOptions);
  const [bio, setBio] = useState<string[]> (app.members.me?.bio || []);
  const [accomplishments, setAccomplishments] = useState<string[]> (app.members.me?.accomplishments || []);

  useEffect (() => {
    if (!lock)
      setUpdate (Object.assign (update, {employmentStatus}))
  }, [employmentStatus]);
  useEffect (() => {
    if (!lock)
      setUpdate (Object.assign (update, {bio}))
  }, [bio]);
  useEffect (() => {
    if (!lock)
      setUpdate (Object.assign (update, {accomplishments}))
  }, [accomplishments]);

  useEffect (() => {
    if (app.members.me?.employmentStatus) setEmploymentStatus (app.members.me.employmentStatus as EmploymentStatusOptions);
    if (app.members.me?.bio) setBio (app.members.me.bio);
    if (app.members.me?.accomplishments) setAccomplishments (app.members.me.accomplishments);
    if (app.members.me) setLock (false);
  }, [app.members.me]);

  if (!app.user.isAuthenticated || app.members.me === null || !app.router.is ('/me')) return null;
  return (
    <main>
      <header>
        <BackButton />
        <h1>{app.members.me.memberName}</h1>
      </header>
      <div>
        <h2>Cover Photo:</h2>
        {
          !coverPhotoLink && app.members.me.coverPhoto &&
          <Upload {...app.members.me.coverPhoto} />
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
          !profilePhotoLink && app.members.me.profilePicture &&
          <Upload {...app.members.me.profilePicture} />
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
        <ArrayEditor maxLength={10} value={bio} onChange={setBio} />
      </div>
      <div>
        <h2>Accomplishments:</h2>
        <ArrayEditor maxLength={10} value={accomplishments} onChange={setAccomplishments} />
      </div>
      <section className="form-group">
        <label>Employment Status:</label>
        <select onChange={e => setEmploymentStatus (e.target.value as EmploymentStatusOptions)}>
          <option value="full time">Full Time</option>
          <option value="part time">Part Time</option>
          <option value="unemployed">Unemployed</option>
        </select>
      </section>
      <div>
        <button onClick={() => app.members.updateInfo (update)}>Submit Changes</button>
      </div>
    </main>
  )
}