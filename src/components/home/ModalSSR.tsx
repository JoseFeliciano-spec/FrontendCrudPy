"use client";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
export default function ModalSSR({
  children,
}: {
  children: React.ReactElement;
}) {
  const router = useRouter();

  const onBack = () => {
    router.back();
  };

  return (
    <Dialog open={true} defaultOpen={true} onOpenChange={onBack}>
      <DialogOverlay>
        <DialogTitle></DialogTitle>
        <DialogContent className="sm:max-w-[500px] h-[600px]">
          {children}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
