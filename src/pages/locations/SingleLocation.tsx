import { useEffect, useState } from "react";
import { useApp } from "../../AppProvider";
import BackButton from "../../components/BackButton";
import DeleteButton from "../../components/DeleteButton";
import { SingleLocationProfile } from "../../components/SingleLocationProfile";
import Location from "../../types/Location";

export default function SingleLocation () {
  const app = useApp ();
  
  const [loc, setLocation] = useState<Location | null> (null);

  useEffect (() => {
    if (app.router.is ('/locations?id=', 'starts with')) {
      let id = app.router.qsp.get ('id');
      setLocation (app.location.locations.find (l => l.id === id) || null);
    }
  }, [app.router.page, app.location.locations])

  if (app.router.is ('/locations?id=', 'starts with') && loc) return (
    <main>
      <header>
        <BackButton />
        <h1>{loc.name}</h1>
        <DeleteButton onDelete={() => app.location.deleteLocation (loc.id || '')} alertText={`Delete the ${loc.name} location.`} />
      </header>
      <SingleLocationProfile {...loc} />
    </main>
  )
  return null;
}