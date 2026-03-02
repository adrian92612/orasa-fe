import { useState } from "react";
import { addDays, startOfDay, endOfDay, addMonths } from "date-fns";
import { useUser } from "@/context/UserContext";
import { useDebounce } from "@/hooks/useDebounce";

export const useAppointmentsPage = () => {
  const { user, selectedBranchId } = useUser();
  const [activeTab, setActiveTab] = useState("today");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [prevBranchId, setPrevBranchId] = useState(selectedBranchId);

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput);
  const [prevSearch, setPrevSearch] = useState("");

  if (selectedBranchId !== prevBranchId) {
    setPrevBranchId(selectedBranchId);
    setPage(0);
  }

  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setPage(0);
  }

  const [allTabDateRange, setAllTabDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(),
    to: addMonths(new Date(), 1),
  });

  const effectiveDateRange = () => {
    const today = new Date();
    if (activeTab === "today") {
      return {
        from: startOfDay(today),
        to: endOfDay(today),
      };
    }
    if (activeTab === "upcoming") {
      return {
        from: startOfDay(addDays(today, 1)),
        to: endOfDay(addDays(today, 7)),
      };
    }
    return allTabDateRange;
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setPage(0);
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setSearchInput("");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (val: string) => {
    setPageSize(Number(val));
    setPage(0);
  };

  return {
    user,
    selectedBranchId,
    activeTab,
    page,
    pageSize,
    statusFilter,
    typeFilter,
    searchInput,
    debouncedSearch,
    allTabDateRange,
    effectiveDateRange,
    setPage,
    setStatusFilter,
    setTypeFilter,
    setSearchInput,
    setAllTabDateRange,
    handleTabChange,
    handlePageChange,
    handlePageSizeChange,
  };
};
