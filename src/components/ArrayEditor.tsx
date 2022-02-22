import { FocusEvent } from "react"

interface ArrayEditorProps {
  maxLength?: number;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function ArrayEditor (props: ArrayEditorProps) {
  const editSection = (index:number) => (e: FocusEvent<HTMLDivElement>) => {
    let arr = [...props.value];
    arr.splice (index, 1, e.target.innerText);
    props.onChange (arr);
  }
  const addSection = (index: number) => () => {
    let arr = [...props.value];
    arr.splice (index, 0, '');
    props.onChange (arr);
  }
  const removeSection = (index: number) => () => {
    let arr = [...props.value];
    arr.splice (index, 1);
    props.onChange (arr);
  }
  if (!props.value.length) return (
    <section className="arrray-editor-group">
      <span className="clickable-action" onClick={addSection (0)}>Add Section</span>
    </section>
  )
  return (
    <>
      {
        props.value.map ((text, i) => (
          <section key={`array-editor-el-${i}`} className="array-editor-group">
            <div contentEditable onBlur={editSection (i)}>{text.length ? text : ''}</div>
            <div className="controls">
              <span className="clickable-action" onClick={removeSection (i)}>Remove Section</span>
              {
                (!props.maxLength || props.value.length < props.maxLength) &&
                ' | '
              }
              {
                (!props.maxLength || props.value.length < props.maxLength) &&
                <span className="clickable-action" onClick={addSection (i + 1)}>Add Section</span>
              }
            </div>
          </section>
        ))
      }
    </>
  )
}