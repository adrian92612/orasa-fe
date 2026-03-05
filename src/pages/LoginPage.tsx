import orasaLogoLight from "@/assets/orasa_logo_light.webp";
import OwnerLoginForm from "@/components/features/auth/OwnerLoginForm";
import StaffLoginForm from "@/components/features/auth/StaffLoginForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router";

export const LoginPage = () => {
  return (
    <main className="dark min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2 bg-slate-950 text-slate-50">
      <div className="flex flex-col items-center justify-center p-8 w-full order-1 lg:order-2 grow lg:grow-0">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <img src={orasaLogoLight} alt="Orasa Logo" className="size-8" />
            <span className="text-xl font-bold tracking-tight italic text-brand-light">Orasa</span>
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-slate-400">Please enter your details to sign in</p>
          </div>

          <Tabs defaultValue="owner" className="w-full">
            <TabsList className="w-full bg-slate-900/50 border-slate-800">
              <TabsTrigger
                value="owner"
                className="data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-slate-400 hover:text-white"
              >
                Owner
              </TabsTrigger>
              <TabsTrigger
                value="staff"
                className="data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-slate-400 hover:text-white"
              >
                Staff
              </TabsTrigger>
            </TabsList>

            <TabsContent value="owner" className="mt-6 ring-offset-background focus-visible:outline-none">
              <div className="min-h-75">
                <OwnerLoginForm />
              </div>
            </TabsContent>

            <TabsContent value="staff" className="mt-6 ring-offset-background focus-visible:outline-none">
              <div className="min-h-75">
                <StaffLoginForm />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-col justify-between p-8 lg:p-12 bg-primary text-primary-foreground relative overflow-hidden order-2 lg:order-1 rounded-t-3xl lg:rounded-none">
        <Link to="/" className="hidden lg:flex items-center gap-2 relative z-10 hover:opacity-80 transition-opacity">
          <img src={orasaLogoLight} alt="Orasa Logo" className="size-10" />
          <span className="text-2xl font-bold tracking-tight italic text-brand-light">Orasa</span>
        </Link>

        <div className="space-y-6 relative z-10 max-w-lg mt-4 lg:mt-0">
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
            Digitalizing appointment management for small businesses.
          </h2>
          <p className="text-foreground/90 text-base lg:text-lg leading-relaxed">
            "Orasa helps you focus on what matters—your clients. Stop worrying about forgotten appointments and manual
            logs."
          </p>
          <div className="flex items-center gap-3 pt-6 border-t border-slate-800/50">
            <div className="size-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-slate-400">M</span>
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-sm">Grow your business</p>
              <p className="text-xs text-slate-400">Simplified Operations</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-foreground relative z-10 mt-12 lg:mt-0 text-center lg:text-left">
          © {new Date().getFullYear()} Orasa. Built for small businesses.
        </p>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-250 bg-accent/30 rounded-full blur-[120px]" />
      </div>
    </main>
  );
};

export default LoginPage;
