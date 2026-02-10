import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserContext";
import { Check, ChevronsUpDown, Store } from "lucide-react";
import { useBranches } from "@/hooks/useBranches";

export const BranchSwitcher = () => {
  const { user, selectedBranchId, setSelectedBranchId } = useUser();
  const { data: branches = [], isLoading } = useBranches();

  if (!user) return null;

  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

  if (!isLoading && branches.length === 1) {
    return (
      <Button
        variant="outline"
        role="combobox"
        disabled
        className="w-[200px] justify-between opacity-100 disabled:opacity-100 bg-muted/50"
      >
        <div className="flex items-center">
          <Store className="mr-2 h-4 w-4" />
          <span className="truncate">{branches[0].name}</span>
        </div>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[200px] justify-between"
          disabled={isLoading}
        >
          <div className="flex items-center truncate">
            <Store className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">
              {selectedBranch ? selectedBranch.name : "All Branches"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>Select Branch</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => setSelectedBranchId(null)}
          className="cursor-pointer"
        >
          <Check
            className={`mr-2 h-4 w-4 ${
              selectedBranchId === null ? "opacity-100" : "opacity-0"
            }`}
          />
          All Branches
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {branches.map((branch) => (
          <DropdownMenuItem
            key={branch.id}
            onSelect={() => setSelectedBranchId(branch.id)}
            className="cursor-pointer"
          >
            <Check
              className={`mr-2 h-4 w-4 ${
                selectedBranchId === branch.id ? "opacity-100" : "opacity-0"
              }`}
            />
            {branch.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
