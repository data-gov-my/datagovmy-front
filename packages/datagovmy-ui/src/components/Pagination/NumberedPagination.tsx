import { FunctionComponent, useContext } from "react";
import { clx } from "../../lib/helpers";
import { WindowContext } from "../../contexts/window";
import { BREAKPOINTS } from "../../lib/constants";

type NumberedPaginationProps = {
  currentPage: number;
  totalPage: number;
  setPage: (newPage: number) => void;
};

const NumberedPagination: FunctionComponent<NumberedPaginationProps> = ({
  currentPage,
  totalPage,
  setPage,
}) => {
  const { size } = useContext(WindowContext);
  // Mobile pagination
  if (size.width < BREAKPOINTS.SM) {
    const BOTTOM_THRESHOLD = 2;
    const MAX_PAGES_DISPLAYED = 3;
    const arr = [];
    for (let i = 1; i <= totalPage; i++) {
      arr.push(i);
    }

    if (totalPage <= MAX_PAGES_DISPLAYED) {
      return (
        <div className="flex items-center gap-1.5">
          {arr.map(item => (
            <PageNumber page={item} currentPage={currentPage} setPage={setPage} />
          ))}
        </div>
      );
    }

    if (currentPage / 2 > 1 && totalPage - currentPage > 1) {
      return (
        <div className="flex items-center gap-1.5">
          <PageNumber page={1} currentPage={currentPage} setPage={setPage} />
          <span>...</span>
          {arr.map((item, index) => {
            if (index + 1 === currentPage)
              return <PageNumber page={index + 1} currentPage={currentPage} setPage={setPage} />;
          })}
          <span>...</span>
          <PageNumber page={totalPage} currentPage={currentPage} setPage={setPage} />
        </div>
      );
    }

    if (currentPage / 2 > 2 && totalPage - currentPage < 2) {
      return (
        <div className="flex items-center gap-1.5">
          <PageNumber page={1} currentPage={currentPage} setPage={setPage} />
          <span>...</span>
          {arr.map((item, index) => {
            if (index + 1 >= totalPage - 1)
              return <PageNumber page={index + 1} currentPage={currentPage} setPage={setPage} />;
          })}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5">
        {arr.map((item, index) => {
          if (index < MAX_PAGES_DISPLAYED - 1)
            return <PageNumber page={index + 1} currentPage={currentPage} setPage={setPage} />;
        })}
        {totalPage > BOTTOM_THRESHOLD + 1 && <span>...</span>}
        {totalPage > BOTTOM_THRESHOLD && (
          <PageNumber page={totalPage} currentPage={currentPage} setPage={setPage} />
        )}
      </div>
    );
  } else {
    const BOTTOM_THRESHOLD = 5;
    const MAX_PAGES_DISPLAYED = 6;
    const arr = [];
    for (let i = 1; i <= totalPage; i++) {
      arr.push(i);
    }

    if (totalPage <= MAX_PAGES_DISPLAYED) {
      return (
        <div className="flex items-center gap-1.5">
          {arr.map(item => (
            <PageNumber page={item} currentPage={currentPage} setPage={setPage} />
          ))}
        </div>
      );
    }

    if (currentPage / 2 > 2 && totalPage - currentPage > 4) {
      return (
        <div className="flex items-center gap-1.5">
          <PageNumber page={1} currentPage={currentPage} setPage={setPage} />
          <span>...</span>
          {arr.map((item, index) => {
            if (
              index + 1 === currentPage - 1 ||
              index + 1 === currentPage ||
              index + 1 === currentPage + 1
            )
              return <PageNumber page={index + 1} currentPage={currentPage} setPage={setPage} />;
          })}
          <span>...</span>
          <PageNumber page={totalPage} currentPage={currentPage} setPage={setPage} />
        </div>
      );
    }

    if (currentPage / 2 > 2 && totalPage - currentPage < 5) {
      return (
        <div className="flex items-center gap-1.5">
          <PageNumber page={1} currentPage={currentPage} setPage={setPage} />
          <span>...</span>
          {arr.map((item, index) => {
            if (index + 1 >= totalPage - 4)
              return <PageNumber page={index + 1} currentPage={currentPage} setPage={setPage} />;
          })}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5">
        {arr.map((item, index) => {
          if (index < MAX_PAGES_DISPLAYED - 1)
            return <PageNumber page={index + 1} currentPage={currentPage} setPage={setPage} />;
        })}
        {totalPage > BOTTOM_THRESHOLD + 1 && <span>...</span>}
        {totalPage > BOTTOM_THRESHOLD && (
          <PageNumber page={totalPage} currentPage={currentPage} setPage={setPage} />
        )}
      </div>
    );
  }
};

const PageNumber = ({
  page,
  currentPage,
  setPage,
}: {
  page: number;
  currentPage: number;
  setPage: (newPage: number) => void;
}) => {
  const isActive = currentPage === page;

  return (
    <div
      onClick={() => setPage(page)}
      className={clx(
        "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium hover:cursor-pointer",
        isActive && "bg-outline"
      )}
    >
      {page}
    </div>
  );
};

export default NumberedPagination;
