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

export const BranchSwitcher = () => {
  const { user, selectedBranchId, setSelectedBranchId } = useUser();

  if (!user) return null;

  const branches = user.branches || [];
  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[200px] justify-between"
        >
          <Store className="mr-2 h-4 w-4" />
          {selectedBranch ? selectedBranch.name : "All Branches"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>Select Branch</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* All Branches Option */}
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

        {/* Individual Branches */}
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
