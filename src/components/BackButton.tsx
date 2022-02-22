import { useApp } from "../AppProvider";
import { back } from "../img";

export default function BackButton () {
  const app = useApp ();

  if (!app.router.hasBack ()) return null;
  return (
    <span onClick={() => app.router.back ()}>
      <img src={back} alt="" />
    </span>
  )
}