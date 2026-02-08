import { Loader2 } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "../ui/button";

type Props = {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const LoadingButton = ({ label, loadingLabel, isLoading, ...rest }: Props) => {
  return (
    <Button disabled={isLoading} {...rest}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {loadingLabel}
        </>
      ) : (
        <span>{label}</span>
      )}
    </Button>
  );
};

export default LoadingButton;
