import { useNavigate } from "react-router";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/routes";

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(APP_ROUTES.LOGIN);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black p-1.5 rounded-lg">
              <Calendar className="text-white size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 italic">
              Orasa
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(APP_ROUTES.LOGIN)}>
              Login
            </Button>
            <Button onClick={handleGetStarted}>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(0,0,0,0.03)_0%,transparent_100%)]" />
          <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-900 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Zap className="size-4" />
              <span>Modernize your appointment logs</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
              Stop using paper logs.{" "}
              <span className="text-black italic">
                Start growing your business.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Orasa helps service-based businesses track appointments and
              automate SMS reminders with zero hassle. Simple, structured, and
              effective.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <Button
                size="lg"
                className="h-12 px-8 text-base shadow-lg shadow-black/10"
                onClick={handleGetStarted}
              >
                Get Started for Free
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
              >
                View Demo
              </Button>
            </div>

            {/* Visual Teaser */}
            <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in duration-1000">
              <div className="aspect-video rounded-xl bg-slate-100 flex items-center justify-center border border-slate-100 overflow-hidden">
                <div className="flex flex-col items-center gap-4">
                  <LayoutDashboard className="size-16 text-slate-300" />
                  <p className="text-slate-400 font-medium italic">
                    Clean & Intuitive Dashboard View
                  </p>
                </div>
              </div>
              {/* Floating elements for visual interest */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <MessageSquare className="size-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      SMS Reminder Sent
                    </p>
                    <p className="text-[10px] text-slate-500">
                      To: +63 917 **** 5678
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Why businesses choose Orasa
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Focused on solving the manual entry problem without adding
                unnecessary complexity.
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
                  description:
                    "Manage multiple branches under one account with branch-specific staff and analytics.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="bg-slate-100 p-3 rounded-xl w-fit mb-6 group-hover:bg-slate-200 transition-colors">
                    <feature.icon className="size-6 text-slate-900" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works / Stats Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
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
                        <item.icon className="size-6 text-slate-900" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {item.title}
                        </h4>
                        <p className="text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-8 shadow-2xl overflow-hidden relative">
                  {/* Abstract background elements */}
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 bg-white/5 rounded-full blur-3xl" />

                  <h3 className="text-2xl font-bold relative z-10">
                    Simple Pricing
                  </h3>
                  <div className="flex items-baseline gap-2 relative z-10">
                    <span className="text-5xl font-extrabold text-white">
                      ₱299
                    </span>
                    <span className="text-slate-400">/ month</span>
                  </div>
                  <p className="text-slate-300 relative z-10">
                    One subscription covers your entire business, regardless of
                    branches or staff.
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
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 p-1 rounded-md">
                <Calendar className="text-white size-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 italic">
                Orasa
              </span>
            </div>

            <div className="flex gap-8 text-sm text-slate-500 font-medium">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact Support
              </a>
            </div>

            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Orasa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
