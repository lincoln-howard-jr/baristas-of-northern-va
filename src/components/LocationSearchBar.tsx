import { useEffect, useState } from "react";
import { useApp } from "../AppProvider";
import { search, cup } from "../img";
import Location from "../types/Location";
import Upload from "./Upload";

interface LocationSearchBarProps {
  active: boolean;
  emptySearchBehaviour: 'hide' | 'show';
  maxResults: number;
  autofocus?: boolean;
  onClick: (location: Location) => void;
  onHover?: (location: Location | undefined) => void;
}

const locationFilter = (searchText: string) => (location: Location) => {
  let st = searchText.toLowerCase ();
  return location.name.toLowerCase ().startsWith (st) || location.address.toLowerCase ().startsWith (st) || location.company.toLowerCase ().startsWith (st);
}

export default function LocationSearchBar (props: LocationSearchBarProps={active: true, maxResults: 5, onClick:console.log, autofocus: true, emptySearchBehaviour: 'hide'}) {
  const app = useApp (); 

  // search for locations
  const [searchText, setSearchText] = useState<string> ('');
  const [searchResults, setSearchResults] = useState<Location[]> ([]);
  useEffect (() => {
    if (searchText === '') return setSearchResults ([]);
    const results = app.location.locations.filter (locationFilter (searchText));
    setSearchResults (results);
  }, [searchText])

  if (!props.active) return null;
  return (
    <section className="form-group">
      {
        <label className="search">
          <input autoFocus={props.autofocus} value={searchText} onChange={e => setSearchText (e.target.value)} placeholder="Location" />
          <img src={search} />
        </label>
      }
      {
        searchText.length === 0 && props.emptySearchBehaviour === 'show' &&
        app.location.locations.filter ((_, i) => i < props.maxResults).map (location => (
          <div key={`location-searchbar-location-${location.id}`} onClick={() => props.onClick (location)} onMouseEnter={() => {
            if (props.onHover) props.onHover (location);
          }} onMouseLeave={() => {
            if (props.onHover) props.onHover (undefined);
          }} className="location">
            {
              location.coverPhoto &&
              <Upload {...location.coverPhoto} />
            }
            {
              !location.coverPhoto &&
              <img src={cup} />
            }
            <h4>{location.name}</h4>
          </div>
        ))
      }
      {
        searchResults.length > 0 &&
        <div className="locations-container">
          {
            searchResults.filter ((_, i) => i < props.maxResults).map (location => (
              <div onClick={() => props.onClick (location)} onMouseEnter={() => {
                if (props.onHover) props.onHover (location);
              }} onMouseLeave={() => {
                if (props.onHover) props.onHover (undefined);
              }} className="location">
                {
                  location.coverPhoto &&
                  <Upload {...location.coverPhoto} />
                }
                {
                  !location.coverPhoto &&
                  <img src={cup} />
                }
                <h4>{location.name}</h4>
              </div>
            ))
          }
        </div>
      }
    </section>
  )
}