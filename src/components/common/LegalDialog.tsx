import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { TERMS_AND_CONDITIONS, PRIVACY_POLICY, type LegalSection } from "@/constants/legal";
import { cn } from "@/lib/utils";

type LegalDialogProps = {
  type: "terms" | "privacy";
  trigger: React.ReactNode;
};

export const LegalDialog = ({ type, trigger }: LegalDialogProps) => {
  const content = type === "terms" ? TERMS_AND_CONDITIONS : PRIVACY_POLICY;
  const title = type === "terms" ? "Terms of Service" : "Privacy Policy";

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="dark max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {type === "terms" ? "Our terms and conditions." : "How we handle your data."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4 text-sm text-slate-400 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
          {content.map((section: LegalSection, idx: number) => (
            <div key={idx} className="space-y-2">
              <strong
                className={cn(
                  "text-slate-200",
                  section.header.startsWith("Part") && "text-base uppercase tracking-wide font-bold",
                )}
              >
                {section.header}
              </strong>
              {section.content.map((paragraph: string, pIdx: number) => (
                <p key={pIdx}>
                  {paragraph.includes(":") ? (
                    <>
                      <strong className="text-slate-300">{paragraph.split(":")[0]}:</strong>
                      {paragraph.substring(paragraph.indexOf(":") + 1)}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </div>
          ))}
        </div>
        <DialogFooter className="p-4 border-t border-slate-800 sm:justify-center">
          <DialogFooter showCloseButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
