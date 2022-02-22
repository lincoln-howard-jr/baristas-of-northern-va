import { useRef } from "react";
import { useApp } from "../AppProvider";
import Location from "../types/Location";
import MemberSearchBar from "./MemberSearchBar";
import Upload from "./Upload";

export function SingleLocationProfile (props: Location) {
  const app = useApp ();
  const inputRef = useRef<HTMLInputElement> (null);
  const upload = async (e: any) => {
    let file = e.target.files [0] as File;
    await app.uploads.createUpload (file, {gallery: (props.galleryId || '')});
    app.alert ('info', 'Image successfully uploaded!');
  }
  return (
    <>
      {
        props.coverPhoto &&
        <div>
          <Upload {...props.coverPhoto} />
        </div>
      }
      <div>
        <h3>Company:</h3>
        {props.company}
        <h3>Location:</h3>
        {props.address}
      </div>
      <div>
        <h3>Gallery:</h3>
        <div className="gallery">
          {
            props.gallery && props.gallery.map (upload => (
              <figure className="square">
                <Upload {...upload} />
              </figure>
            ))
          }
        </div>
        <span className="clickable-action" onClick={() => inputRef.current?.click ()}>Upload a New Gallery Photo</span>
        <input type="file" ref={inputRef} hidden={true} onChange={upload} />
      </div>
      <div>
        <h2>The {props.name} team:</h2>
        <MemberSearchBar active maxResults={5} emptySearchBehaviour="show" onClick={m => app.router.redirect (`/members?id=${m.id}`)} filter={m => m.memberLocation.id === props.id} />
      </div>
    </>
  )
}