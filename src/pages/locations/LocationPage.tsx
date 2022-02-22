import { useState } from "react";
import { useApp } from "../../AppProvider";
import BackButton from "../../components/BackButton";
import LocationSearchBar from "../../components/LocationSearchBar";
import { SingleLocationProfile } from "../../components/SingleLocationProfile";
import Location from "../../types/Location";

export default function LocationPage () {
  const app = useApp ();

  const [preview, setPreview] = useState<Location | undefined> (undefined);

  if (app.user.isAuthenticated && app.router.is ('/locations', 'exact')) return (
    <main className="locations-container">
      <header>
        <BackButton />
        <h1>Locations</h1>
      </header>
      <div className="pint-size">
        <LocationSearchBar active emptySearchBehaviour="show" maxResults={5} onClick={location => app.router.redirect (`/locations?id=${location.id}`)} />
      </div>
      <div className="big-boi">
        <LocationSearchBar active emptySearchBehaviour="show" maxResults={5} onClick={setPreview} />
      </div>
      <div className="big-boi">
        {
          !!preview &&
          <>
            <h2>{preview.name}</h2>
            <SingleLocationProfile {...preview} />
          </>
        }
      </div>
    </main>
  )
  return null;
}