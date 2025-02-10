import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";

export interface PaginationState<T> {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    firstPage: () => void;
    lastPage: () => void;
    paginatedItems: T[];
}

export function usePagination<T>(items: T[], initialPage = 1, pageSize = 5): PaginationState<T> {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const totalPages = Math.ceil(items.length / pageSize);

    const setPage = (i: number) => setCurrentPage((_) => Math.max(Math.min(i, totalPages), 1) );
    const firstPage = () => setCurrentPage((_) => 1);
    const lastPage = () => setCurrentPage((_) => totalPages);
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
     
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [items, totalPages, currentPage]);

    useEffect(() => {
        setCurrentPage(initialPage);
    }, [items, initialPage]);

    const paginatedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return { currentPage, pageSize, totalPages, setCurrentPage: setPage, nextPage, prevPage, firstPage, lastPage, paginatedItems };
}
interface PaginationComponentProps<T> {
    pagination: PaginationState<T>;
}

const NuPagination = <T,>({ pagination }: PaginationComponentProps<T>) => {
    const { currentPage, pageSize, totalPages, setCurrentPage, nextPage, prevPage, firstPage, lastPage, } = pagination;
  return (
      <Pagination >
          {totalPages > 3 && currentPage > 2 &&<Pagination.First onClick={firstPage} />}
          {currentPage !== 1 && <Pagination.Prev onClick={prevPage} />}
          {totalPages <= 3 && Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
              </Pagination.Item>
          ))}
          {totalPages > 3 && currentPage > 3 && <Pagination.Ellipsis onClick={() => setCurrentPage(currentPage - 3)} />}
          {totalPages > 3 && Array.from([currentPage - 3, currentPage - 2, currentPage - 1, currentPage, currentPage + 1], (i, _) => (
              i >= 0 &&
              i < totalPages &&
              <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
              </Pagination.Item>
          ))}
          {totalPages > 3 && currentPage < totalPages - 2 && <Pagination.Ellipsis onClick={() => setCurrentPage(currentPage + 3)} />}
          {currentPage !== totalPages && <Pagination.Next onClick={nextPage} />}
          {totalPages > 3 && currentPage < totalPages - 1 && <Pagination.Last onClick={lastPage} />}
      </Pagination>
  );
}

export default NuPagination;