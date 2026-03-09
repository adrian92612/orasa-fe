import { useNavigate, Link } from "react-router";
import {
  Calendar,
  MessageSquare,
  Users,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/common/BrandLogo";
import { APP_ROUTES } from "@/constants/routes";
import statsLight from "@/assets/orasa-stats.webp";
import statsDark from "@/assets/orasa-stats-dark.webp";
import statsMobileLight from "@/assets/orasa-stats-mobile.webp";
import statsMobileDark from "@/assets/orasa-stats-mobile-dark.webp";
import appointmentsLight from "@/assets/orasa-appointments.webp";
import appointmentsDark from "@/assets/orasa-appointments-dark.webp";
import appointmentsMobileLight from "@/assets/orasa-appointments-mobile.webp";
import appointmentsMobileDark from "@/assets/orasa-appointments-mobile-dark.webp";
import smsLogsLight from "@/assets/orasa-sms-logs.webp";
import smsLogsDark from "@/assets/orasa-sms-logs-dark.webp";
import smsLogsMobileLight from "@/assets/orasa-sms-logs-mobile.webp";
import smsLogsMobileDark from "@/assets/orasa-sms-logs-mobile-dark.webp";
import { LegalDialog } from "@/components/common/LegalDialog";
import { useState } from "react";

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(APP_ROUTES.LOGIN);
  };

  const [activeTab, setActiveTab] = useState<"stats" | "appointments" | "sms">("stats");
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <BrandLogo />
          </Link>
          <div className="flex items-center gap-4">
            <Button onClick={handleGetStarted}>Log In</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Zap className="size-4" />
              <span>Modernize your appointment logs</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
              Stop using paper logs. <span className="text-slate-300 italic">Start growing your business.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <span className="font-urbanist text-brand-light">ORASA</span> helps service-based businesses track
              appointments and automate SMS reminders with zero hassle. Simple, structured, and effective.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-black/10" onClick={handleGetStarted}>
                Get Started for Free
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                View Demo
              </Button>
            </div>

            {/* Product Showcase */}
            <div className="mt-20 space-y-10 animate-in fade-in zoom-in duration-1000">
              <div className="flex flex-col items-center gap-6">
                {/* Desktop Tabs (Horizontal pills) */}
                <div className="hidden md:flex p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
                  <button
                    onClick={() => setActiveTab("stats")}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === "stats"
                        ? "bg-slate-800 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <BarChart3 className="size-4" />
                    Performance Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab("appointments")}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === "appointments"
                        ? "bg-slate-800 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Calendar className="size-4" />
                    Appointment Management
                  </button>
                  <button
                    onClick={() => setActiveTab("sms")}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === "sms" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <MessageSquare className="size-4" />
                    SMS Audit Logs
                  </button>
                </div>

                {/* Mobile Tabs (Vertical stack / Large Cards) */}
                <div className="md:hidden grid grid-cols-1 gap-3 w-full max-w-sm px-4">
                  {[
                    { id: "stats", label: "Analytics", icon: BarChart3, desc: "Business metrics" },
                    { id: "appointments", label: "Appointments", icon: Calendar, desc: "Schedule tracking" },
                    { id: "sms", label: "SMS Logs", icon: MessageSquare, desc: "Message history" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as "stats" | "appointments" | "sms")}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                        activeTab === tab.id
                          ? "bg-slate-800 border-primary text-white shadow-xl shadow-primary/10"
                          : "bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900"
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl ${activeTab === tab.id ? "bg-primary text-white" : "bg-slate-800 text-slate-300"}`}
                      >
                        <tab.icon className="size-5" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-sm">{tab.label}</span>
                        <span className="text-[10px] opacity-70 leading-none">{tab.desc}</span>
                      </div>
                      {activeTab === tab.id && (
                        <div className="ml-auto">
                          <CheckCircle2 className="size-4 text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative group mx-auto max-w-5xl">
                {/* Desktop View (Visible on md+) */}
                <div className="hidden md:block relative animate-in fade-in slide-in-from-bottom-10 duration-1000">
                  <div className="absolute -inset-1 bg-linear-to-r from-brand-light/20 to-primary/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

                  <div className="relative rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-2xl overflow-hidden">
                    <div className="absolute bottom-6 right-6 z-10">
                      <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/50 backdrop-blur-md border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                      >
                        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                      </button>
                    </div>

                    <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center relative shadow-inner">
                      <div
                        key={`desktop-${activeTab}-${isDarkMode}`}
                        className="absolute inset-0 transition-all duration-1000 ease-in-out animate-in fade-in fill-mode-both"
                      >
                        <img
                          src={
                            activeTab === "stats"
                              ? isDarkMode
                                ? statsDark
                                : statsLight
                              : activeTab === "appointments"
                                ? isDarkMode
                                  ? appointmentsDark
                                  : appointmentsLight
                                : isDarkMode
                                  ? smsLogsDark
                                  : smsLogsLight
                          }
                          alt={`${activeTab} ${isDarkMode ? "Dark" : "Light"} mode`}
                          className="w-full h-full object-contain hover:scale-[1.02] transition-transform duration-1000 ease-out"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Desktop Only Decorative floating cards */}
                  <div className="absolute -bottom-8 -left-8 bg-slate-900 p-5 rounded-2xl shadow-2xl border border-slate-800 hidden lg:block hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                        <CheckCircle2 className="size-6 text-emerald-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-white">SMS Reminder Delivered</p>
                        <p className="text-xs text-slate-400">Juan Dela Cruz • Confirmed</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-8 -right-8 bg-slate-900 p-5 rounded-2xl shadow-2xl border border-slate-800 hidden lg:block hover:translate-y-2 transition-transform duration-500">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                        <Zap className="size-6 text-blue-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-white">+12% Growth</p>
                        <p className="text-xs text-slate-400">Monthly Revenue Increase</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile View (Visible only on mobile) */}
                <div className="md:hidden flex flex-col items-center animate-in fade-in zoom-in duration-1000">
                  {/* Mode toggle for mobile */}
                  <div className="mb-6">
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                    >
                      {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    </button>
                  </div>

                  <div className="relative w-64 aspect-[9/18.5] border-none rounded-[2.5rem] overflow-hidden">
                    <div
                      key={`mobile-${activeTab}-${isDarkMode}`}
                      className="absolute inset-0 transition-all duration-1000 ease-in-out animate-in fade-in fill-mode-both"
                    >
                      <img
                        src={
                          activeTab === "stats"
                            ? isDarkMode
                              ? statsMobileDark
                              : statsMobileLight
                            : activeTab === "appointments"
                              ? isDarkMode
                                ? appointmentsMobileDark
                                : appointmentsMobileLight
                              : isDarkMode
                                ? smsLogsMobileDark
                                : smsLogsMobileLight
                        }
                        alt={`${activeTab} Mobile ${isDarkMode ? "Dark" : "Light"} mode`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Mobile Decorative floating cards */}
                  <div className="absolute -bottom-6 left-2 bg-slate-900 p-3 rounded-xl shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-left-5 duration-1000 delay-500">
                    <div className="flex items-center gap-2">
                      <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 shadow-emerald-500/10 shadow-inner">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-white leading-tight">SMS Delivered</p>
                        <p className="text-[8px] text-slate-400">Juan • Confirmed</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-10 right-4 bg-slate-900 p-3 rounded-xl shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-right-5 duration-1000 delay-700">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500/10 p-1.5 rounded-lg border border-blue-500/20 shadow-blue-500/10 shadow-inner">
                        <Zap className="size-4 text-blue-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-white leading-tight">+12% Growth</p>
                        <p className="text-[8px] text-slate-400">Revenue Update</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="dark py-24 bg-slate-900 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight">
                Why businesses choose <span className="font-urbanist font-black uppercase">ORASA</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Focused on solving the manual entry problem without adding unnecessary complexity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Calendar,
                  title: "Appointment Tracking",
                  description:
                    "Manage all your appointments in a clean, organized list. No more messy logbooks and missed entries.",
                },
                {
                  icon: MessageSquare,
                  title: "Automated Reminders",
                  description:
                    "Send automated SMS reminders to your clients to reduce no-shows and keep your schedule full.",
                },
                {
                  icon: LayoutDashboard,
                  title: "Multi-branch Ready",
                  description: "Manage multiple branches under one account with branch-specific staff and analytics.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 group"
                >
                  <div className="bg-slate-800 p-3 rounded-xl w-fit mb-6 group-hover:bg-slate-700 transition-colors">
                    <feature.icon className="size-6 text-slate-100" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works / Stats Section */}
        <section className="py-24 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  Built for the real-world small business workflow
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      icon: ShieldCheck,
                      title: "Secure & Reliable",
                      desc: "Built with modern technology to ensure your business data is always safe.",
                    },
                    {
                      icon: Clock,
                      title: "Save 5+ Hours Weekly",
                      desc: "Automate the manual tasks of tracking and reminding clients.",
                    },
                    {
                      icon: Users,
                      title: "Staff Friendly",
                      desc: "Designed for ease of use. Your staff can pick it up in minutes.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 mt-1">
                        <item.icon className="size-6 text-slate-100" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{item.title}</h4>
                        <p className="text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-primary rounded-3xl p-8 text-primary-foreground space-y-8 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 bg-white/5 rounded-full blur-3xl" />

                  <h3 className="text-2xl font-bold relative z-10">Simple Pricing</h3>
                  <div className="flex items-baseline gap-2 relative z-10">
                    <span className="text-5xl font-extrabold text-white">₱299</span>
                    <span className="text-slate-400">/ month</span>
                  </div>
                  <p className="text-slate-300 relative z-10">
                    One subscription covers your entire business, regardless of branches or staff.
                  </p>

                  <ul className="space-y-4 relative z-10">
                    {[
                      "100 Free SMS monthly",
                      "Unlimited Appointments",
                      "Multi-branch support",
                      "Staff dashboards",
                      "Activity & SMS Logs",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 text-white" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full h-12 text-lg font-bold shadow-lg shadow-black/40 relative z-10 bg-white text-black hover:bg-slate-100"
                    onClick={handleGetStarted}
                  >
                    Start Your Journey
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <BrandLogo logoClassName="size-6" textClassName="text-lg" />
            </Link>

            <div className="flex gap-8 text-sm text-slate-400 font-medium">
              <LegalDialog
                type="privacy"
                trigger={
                  <button className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</button>
                }
              />
              <LegalDialog
                type="terms"
                trigger={
                  <button className="hover:text-primary transition-colors cursor-pointer">Terms of Service</button>
                }
              />
              <a href="#" className="hover:text-primary transition-colors">
                Contact Support
              </a>
            </div>

            <p className="text-sm text-slate-500 flex items-center gap-1">
              © {new Date().getFullYear()}{" "}
              <BrandLogo showText logoClassName="size-4" textClassName="text-sm font-black mt-0" />. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
