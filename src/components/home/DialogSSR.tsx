"use client";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
export default function DialogSSR({
  children,
}: {
  children: React.ReactElement;
}) {
  const router = useRouter();

  const onBack = () => {
    router.back();
  };

  return (
    <Drawer open={true} onClose={onBack}>
      <DrawerContent className="lg:hidden">
        <DrawerHeader>{children}</DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
