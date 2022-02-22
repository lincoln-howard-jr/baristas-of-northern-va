import CreateLocation from "../pages/locations/CreateLocation";
import LocationPage from "../pages/locations/LocationPage";
import SingleLocation from "../pages/locations/SingleLocation";

export default function LocationsGroup () {
  return (
    <>
      <LocationPage />
      <SingleLocation />
      <CreateLocation />
    </>
  )
}