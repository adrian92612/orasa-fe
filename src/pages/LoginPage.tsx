import { Calendar } from "lucide-react";
import OwnerLoginForm from "@/components/features/auth/OwnerLoginForm";
import StaffLoginForm from "@/components/features/auth/StaffLoginForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LoginPage = () => {
  return (
    <main className="min-h-screen w-full grid lg:grid-cols-2 bg-white">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-950 text-white relative overflow-hidden">
        <div className="flex items-center gap-2 relative z-10">
          <div className="bg-white p-1 rounded-md">
            <Calendar className="text-black size-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight italic">
            Orasa
          </span>
        </div>

        <div className="space-y-6 relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold leading-tight">
            Digitalizing appointment management for small businesses.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            "Orasa helps you focus on what matters—your clients. Stop worrying
            about forgotten appointments and manual logs."
          </p>
          <div className="flex items-center gap-3 pt-6 border-t border-slate-800/50">
            <div className="size-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-500">M</span>
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-sm">
                Grow your business
              </p>
              <p className="text-xs text-slate-500">Simplified Operations</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 relative z-10">
          © {new Date().getFullYear()} Orasa. Built for small businesses.
        </p>

        {/* Abstract background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-slate-400/5 rounded-full blur-[120px]" />
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-col items-center justify-center p-8 w-full">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-black p-1 rounded-md">
              <Calendar className="text-white size-4" />
            </div>
            <span className="text-xl font-bold tracking-tight italic">
              Orasa
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-slate-500">
              Please enter your details to sign in
            </p>
          </div>

          <Tabs defaultValue="owner" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-50 p-1 border border-slate-200/50">
              <TabsTrigger
                value="owner"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Owner
              </TabsTrigger>
              <TabsTrigger
                value="staff"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Staff
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="owner"
              className="mt-0 ring-offset-background focus-visible:outline-none"
            >
              <div className="bg-white">
                <OwnerLoginForm />
              </div>
            </TabsContent>

            <TabsContent
              value="staff"
              className="mt-0 ring-offset-background focus-visible:outline-none"
            >
              <div className="bg-white">
                <StaffLoginForm />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
