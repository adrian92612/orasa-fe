import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type ServiceSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

const ServiceSearch = ({ value, onChange }: ServiceSearchProps) => {
  return (
    <div className="flex items-center gap-2 max-w-sm">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search name, description, or price..."
          className="pl-9 h-10 rounded-xl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ServiceSearch;
