import { useEffect, useState } from "react"

interface ListControlsProps {
  shouldShow: boolean;
  countPerPage: number;
  list: any[];
  onChange: (page: number) => void;
}

export default function ListControls (props: ListControlsProps) {
  const [currentPage, setPage] = useState<number> (0);
  const [totalPages, setTotalPages] = useState<number> (0);

  useEffect (() => {
    setTotalPages (Math.ceil (props.list.length / props.countPerPage));
  }, [props.countPerPage, props.list])
  
  useEffect (() => {
    props.onChange (currentPage);
  }, [currentPage]);

  if (props.shouldShow && totalPages > 1) return (
    <section>
      <div className="controls">
        {
          currentPage !== 0 &&
          <span className="clickable-action prev" onClick={() => setPage (currentPage - 1)}>Back</span>
        }
        {
          currentPage < (totalPages - 1) &&
          <span className="clickable-action next" onClick={() => setPage (currentPage + 1)}>Next</span>
        }
        <div className="form-block-container">
          {
            new Array (totalPages).fill (1).map ((_, i) => (
              <span className={"form-block" + (i === currentPage ? ' active' : '')} onClick={() => setPage (i)} />
            ))
          }
        </div>
      </div>
    </section>
  )
  return null;
}