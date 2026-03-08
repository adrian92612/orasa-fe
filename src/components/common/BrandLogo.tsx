import orasaLogo from "@/assets/orasa-logo.webp";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  logoClassName?: string;
  textClassName?: string;
  showText?: boolean;
};

export function BrandLogo({ className, logoClassName, textClassName, showText = true }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <img src={orasaLogo} alt="Orasa Logo" className={cn("size-8 shrink-0", logoClassName)} />
      {showText && (
        <span className={cn("text-xl tracking-[-0.0375rem] text-brand-light font-urbanist", textClassName)}>ORASA</span>
      )}
    </div>
  );
}
