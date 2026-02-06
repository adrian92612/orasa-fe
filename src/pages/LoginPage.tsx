import OwnerLoginForm from "@/components/features/auth/OwnerLoginForm";
import StaffLoginForm from "@/components/features/auth/StaffLoginForm";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";

export const LoginPage = () => {
  const { isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-700">
      <div className="w-full max-w-md space-y-8 min-h-[530px] p-6 rounded-lg bg-background shadow-2xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center"></div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your Orasa account</p>
        </div>

        <Tabs defaultValue="owner" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="owner">Owner</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>

          <TabsContent value="owner">
            <OwnerLoginForm />
          </TabsContent>

          <TabsContent value="staff">
            <StaffLoginForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default LoginPage;
