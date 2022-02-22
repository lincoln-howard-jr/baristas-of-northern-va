import { useEffect, useState } from "react";
import { useApp } from "../AppProvider";
import { beans, search } from "../img";
import Member from "../types/Member";
import ListControls from "./ListControls";
import Upload from "./Upload";

interface MemberSearchBarProps {
  active: boolean;
  emptySearchBehaviour: 'hide' | 'show';
  maxResults: number;
  autofocus?: boolean;
  onClick: (member: Member) => void;
  onHover?: (member: Member | undefined) => void;
  filter?: (member: Member) => boolean
}

const memberFilter = (searchText: string) => (member: Member) => {
  let st = searchText.toLowerCase ();
  return member.memberName.toLowerCase ().split (' ').find (n => n.startsWith (st));
}

export default function MemberSearchBar (props: MemberSearchBarProps={active: true, maxResults: 5, onClick:console.log, onHover:console.log, autofocus: true, emptySearchBehaviour: 'hide', filter: () => true}) {
  const app = useApp (); 

  const [members, setMembers] = useState<Member[]> (app.members.members);
  const [page, setPage] = useState<number> (0);
  
  const onHover = (member: Member | undefined) => () => {
    if (props.onHover) props.onHover (member);
  }

  useEffect (() => {
    if (props.filter) setMembers (app.members.members.filter (props.filter));
  }, [app.members.members, props.filter])
  // search for locations
  const [searchText, setSearchText] = useState<string> ('');
  const [searchResults, setSearchResults] = useState<Member[]> ([]);
  useEffect (() => {
    if (searchText === '') return setSearchResults ([]);
    let results = members.filter (memberFilter (searchText));
    setSearchResults (results);
  }, [searchText, members])

  if (!props.active) return null;
  return (
    <section className="form-group">
      <label className="search">
        <input autoFocus={props.autofocus} value={searchText} onChange={e => setSearchText (e.target.value)} placeholder="Member" />
        <img src={search} />
      </label>
      <div className="member-container">
        {
          searchText.length === 0 && props.emptySearchBehaviour === 'show' &&
          members.filter ((_, i) => i >= props.maxResults * page && i < props.maxResults * (page + 1)).map (member => (
            <div key={`member-searchbar-location-${member.id}`} onClick={() => props.onClick (member)} onMouseOver={onHover (member)} onMouseLeave={onHover (undefined)} className="member">
            {
              member.profilePicture &&
              <span className="profile-picture">
                <Upload {...member.profilePicture}/>
              </span>
            }
            {
              !member.profilePicture &&
              <img src={beans} />
            }
            <h4>{member.memberName}</h4>
            </div>
          ))
        }
        {
          searchResults.length > 0 &&
          <>
            {
              searchResults.filter ((_, i) => i >= props.maxResults * page && i < (props.maxResults) * (page + 1)).map (member => (
                <div onClick={() => props.onClick (member)} className="member">
                  {
                    member.profilePicture &&
                    <Upload {...member.profilePicture} />
                  }
                  {
                    !member.profilePicture &&
                    <img src={beans} />
                  }
                  <h4>{member.memberName}</h4>
                </div>
              ))
            }
          </>
        }
      </div>
      <ListControls onChange={setPage} shouldShow={props.emptySearchBehaviour === 'show' ? (searchResults.length ? searchResults.length > props.maxResults : app.members.members.length > props.maxResults) : searchResults.length > props.maxResults} countPerPage={props.maxResults} list={searchResults.length ? searchResults : members} />
    </section>
  )
}