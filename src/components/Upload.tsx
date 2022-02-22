import { useApp } from "../AppProvider";
import trunc from "../lib/trunc";
import {default as UploadProps} from "../types/Upload";

export default function Upload (props: UploadProps) {
  const app = useApp ();
  const onDblClick = () => {
    if (app.user.role !== 'admin' && app.user.role !== 'superuser') return;
    app.alert ('warning', `Delete upload with id ${trunc (props.id, 12)}`, 'Are you sure?', [{
      name: 'Delete',
      onAction: () => app.uploads.removeUpload (props.id)
    }])
  }
  if (props.contentType?.startsWith ('image')) return (
    <img onDoubleClick={onDblClick} src={props.url} />
  );
  if (props.contentType?.startsWith ('video')) return (
    <video onDoubleClick={onDblClick} autoPlay loop muted>
      <source src={props.url} />
    </video>
  );
  return null;
}