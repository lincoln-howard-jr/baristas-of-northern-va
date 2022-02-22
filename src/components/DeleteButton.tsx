import { useApp } from "../AppProvider";
import { bucket } from "../img";
interface DeleteButtonprops {
  alertText: string;
  onDelete: () => void
}
export default function DeleteButton (props: DeleteButtonprops) {
  const app = useApp ();

  const actions = [
    {
      name: 'Delete',
      onAction: props.onDelete
    }
  ]

  const onDelete = () => {
    app.alert ('warning', props.alertText, 'Are You Sure?', actions)
  }
    
  if (app.user.role !== 'superuser') return null;
  return (
    <span onClick={onDelete}>
      <img src={bucket} alt="" />
    </span>
  )
}