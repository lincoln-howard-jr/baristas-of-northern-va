import { useEffect, useState } from "react";
import { useApp } from "../AppProvider";
import { tap } from "../img";

export default function SwipeSuggestion () {
  const app = useApp ();
  const [cn, setCn] = useState<'swipe-suggestion-container show' | 'swipe-suggestion-container'> ("swipe-suggestion-container");

  useEffect (() => {
    const page = `${app.router.page}`;
    setTimeout (() => {
      if (app.router.page === page && app.user.isAuthenticated) {
        setCn ('swipe-suggestion-container show');
      }
    }, 4500)
  }, [app.user.isAuthenticated]);

  return (
    <div onTouchStart={() => setCn ('swipe-suggestion-container')} onClick={() => setCn ('swipe-suggestion-container')} className={cn}>
      <div>
        <img src={tap} />
        <p>
          Swipe to open the navigation
        </p>
      </div>
    </div>
  )
}