import Nav from './components/Nav';
import { authBkg } from './img';
import AuthPage from './pages/AuthPage';
import PageNotFound from './pages/PageNotFound';
import Dashboard from './pages/Dashboard';
import SwipeSuggestion from './components/SwipeSuggestion';
import ChatGroup from './page-groups/Chat';
import ForumGroup from './page-groups/Forum';
import MembersGroup from './page-groups/Members';
import LocationsGroup from './page-groups/Locations';
import InvitesGroup from './page-groups/Invites';

function App() {
  return (
    <>
      <div className="background-container">
        <img className="background-image" src={authBkg} alt="" />
      </div>
      <Nav />
      <SwipeSuggestion />
      <div className="glass-panel">
        {/* auxilary stuff */}
        <AuthPage />
        <Dashboard />
        <PageNotFound />
        <>
          {/* groups of components */}
          <ChatGroup />
          <ForumGroup />
          <MembersGroup />
          <LocationsGroup />
          <InvitesGroup />
        </>
      </div>
    </>
  );
}

export default App;
