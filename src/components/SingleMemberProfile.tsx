import { useApp } from "../AppProvider";
import { printDate } from "../lib/formatDate";
import Member from "../types/Member";
import Upload from "./Upload";

interface RoleDict {
  [x: string]: string
}

const roleDict:RoleDict = {
  barista: 'Barista',
  supervisor: 'Supervisor',
  manager: 'Store Manager',
  admin: 'Novabaristas Administrator',
  superuser: 'Novabaristas Administrator'
}

export default function SingleMemberProfile (props: Member) {
  const app = useApp ();
  return (
    <>
      {
        props.id === app.members.me?.id &&
        <div>
          <h2>Hey {props.memberName}</h2>
          <a onClick={() => app.router.redirect ('/me')}>Click here to edit your profile!</a>
        </div>
      }
      {
        props.coverPhoto && props.profilePicture &&
        <>
          <div className="cover-photo">
            <Upload {...props.coverPhoto} />
          </div>
          <div className="profile-picture">
            <Upload {...props.profilePicture} />
          </div>
        </>
      }
      <div className="overview">
        <h1>{props.memberName}</h1>
        <p>{roleDict [props.memberRole]} for {props.memberLocation.company} at {props.memberLocation.name}</p>
        <p>Novabaristas Member since {printDate (new Date (1000 * props.acceptedAt))}</p>
      </div>
      { props.bio &&
        <>
          <div>
            <h2>About {props.memberName}</h2>
          </div>
          {
            props.bio.map (text => (
              <p className="bio">{text}</p>
            ))
          }
        </>
      }
      { props.accomplishments &&
        <>
          <div>
            <h2>Accomplishments</h2>
          </div>
          {
            props.accomplishments.map (text => (
              <p className="accomplishment">{text}</p>
            ))
          }
        </>
      }
    </>
  )
}