import { useEffect, useState } from "react"
import { useApp } from "../AppProvider";

interface CounterProps {
  count: number;
  title: string;
  path: string;
}
export default function Counter (props: CounterProps) {
  const app = useApp ();
  const [segments, setSegments] = useState<string[]> ([]);
  useEffect (() => {
    let words = props.title.split (' ');
    const resultingSegments = [''];
    let i = 0;
    while (words.length) {
      let word = words.shift ();
      if (word && resultingSegments [i].length + word.length < 10) {
        resultingSegments [i] += (resultingSegments [i].length ? ' ' : '') + word;
      } else if (word) {
        resultingSegments.push (word);
        i++;
      }
    }
    setSegments (resultingSegments);
  }, [props.title]);
  return (
    <svg className="counter" onClick={() => app.router.redirect (props.path)} viewBox="0 0 100 100">
      <style>
        {
        `
          svg.counter {
            cursor: pointer;
          }
          svg.counter rect {
            transition: 0.2s;
            fill: #854a47ff;
            stroke: #211312;
          }
          svg.counter text {
            transition: 0.3s;
            fill: #ffffff;
          }
          @media (hover: hover) {
            svg.counter:hover rect {
              fill: #854a4700;
            }
            svg.counter:hover text {
              fill: #211312;
            }
          }
        ` 
        }
      </style>
      <rect x={10} width={80} y={10} height={80} rx={10} ry={10} strokeWidth={2} />
      <text x={50} y={50} textAnchor="middle" fontSize={40} >{props.count}</text>
      {
        segments.map ((segment, i) => (
          <text x={50} y={68 + i * 14} fontSize={10} textAnchor="middle">{segment}</text>
        ))
      }
    </svg>
  )
}