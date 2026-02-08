import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ServicePaginationProps = {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
};

const ServicePagination = ({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
}: ServicePaginationProps) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (currentPage - 1) * pageSize;
  const pageSizeOptions = [5, 10, 20, 50];

  return (
    <div className="flex flex-col gap-4 border-t pt-4 px-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-medium">{start + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{" "}
          of <span className="font-medium">{totalItems}</span> services
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Rows per page
          </span>
          <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
            <SelectTrigger className="h-8 w-[70px] rounded-lg text-xs">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                  className="text-xs"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const targetPage =
                  currentPage > 1 ? currentPage - 1 : totalPages;
                onPageChange(targetPage);
              }}
              className="cursor-pointer"
            />
          </PaginationItem>

          {totalPages <= 7 ? (
            Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i + 1} className="hidden sm:inline-block">
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(i + 1);
                  }}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))
          ) : (
            <PaginationItem>
              <span className="text-sm px-4">
                Page {currentPage} of {totalPages}
              </span>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const targetPage =
                  currentPage < totalPages ? currentPage + 1 : 1;
                onPageChange(targetPage);
              }}
              className="cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ServicePagination;
