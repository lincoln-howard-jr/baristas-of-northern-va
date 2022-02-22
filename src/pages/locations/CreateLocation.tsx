import { useEffect, useRef, useState } from "react";
import { useApp } from "../../AppProvider"
import BackButton from "../../components/BackButton";

export default function CreateLocation () {
  const app = useApp ();

  const [disabled, setDisabled] = useState<boolean> (true);

  const [name, setName] = useState<string> ('');
  const [address, setAddress] = useState<string> ('');
  const [company, setCompany] = useState<string> ('');
  const [coverPhoto, setCoverPhoto] = useState<string | undefined> (undefined);

  const coverPhotoRef = useRef<HTMLInputElement> (null);
  const [coverPhotoLink, setLink] = useState<string | null> (null);

  useEffect (() => {
    // update disabled value based on form components
    let d = name.length > 0 && address.length > 0 && company.length > 0;
    setDisabled (!d);
  }, [name, address, company, coverPhoto])

  const upload = async (e: any) => {
    let file = e.target.files [0] as File;
    let obj = await app.uploads.createUpload (file, {});
    setCoverPhoto (obj.id as string);
    setLink (obj.imageUrl as string);
  }

  const createLocation = async () => {
    if (disabled) return;
    try {
      await app.location.createLocation ({name, address, company, coverPhoto})
      app.alert ('info', `New location, ${name}, created!`)
      setName ('');
      setAddress ('');
      setCompany ('');
      setCoverPhoto ('');
    } catch (e) {
      app.alert ('error', 'Unable to create location, please try again and contact an administrator if this is a continued issue.')
    }
  }

  if (app.user.role !== 'admin' && app.user.role !== 'superuser') return null;
  if (app.user.isAuthenticated && app.router.is ('/create-location')) return (
    <main>
      <header>
        <BackButton />
        <h1>Create Location</h1>
      </header>
      <section className="form-group">
        <label>Location Name</label>
        <input value={name} onChange={e => setName (e.target.value)} placeholder="..." />
      </section>
      <section className="form-group">
        <label>Full Address</label>
        <input value={address} onChange={e => setAddress (e.target.value)} placeholder="..." />
      </section>
      <section className="form-group">
        <label>Company Name</label>
        <input value={company} onChange={e => setCompany (e.target.value)} placeholder="..." />
      </section>
      <section className="form-group">
        <label>Cover Photo</label>
        {
          !coverPhoto &&
          <>
            <a onClick={() => {coverPhotoRef.current?.click ()}}>Upload</a>
            <input type="file" ref={coverPhotoRef} onChange={upload} />
          </>
        }
        {
          !!coverPhotoLink &&
          <img src={coverPhotoLink} />
        }
      </section>
      <section className="form-group">
        <button onClick={createLocation} disabled={disabled}>Create Location</button>
      </section>
    </main>
  )
  return null;
}