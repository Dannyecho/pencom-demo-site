import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, LayoutGrid, BookOpen, Users, Bell, MessageSquare,
  TrendingUp, ArrowRightLeft, UserPlus,
  FileCheck, Phone, MapPin,
  ArrowUpRight, Search, Landmark, ChevronLeft, Fingerprint,
  Scan, Volume2, Type, CheckCircle,
  Clock, ChevronDown, ChevronUp, Download, WifiOff,
  Eye, EyeOff, Send,
  Smartphone, Accessibility
} from "lucide-react";
import { operators } from "@/lib/data";

// =============================================================================
// TYPES
// =============================================================================
type ScreenName = "biometric" | "dashboard" | "publications" | "pfa" | "guidance" | "notifications" | "feedback" | "accessibility" | null;

// =============================================================================
// MOBILE APP DATA
// =============================================================================

const quickTiles = [
  { label: "RSA Balance", value: "N12,847,500", change: "+7.2%", icon: TrendingUp, color: "#117F21" },
  { label: "PFA Name", value: "ARM Pension", change: "View Details", icon: Landmark, color: "#1E88E5" },
  { label: "Contributions", value: "N125,000", change: "This Month", icon: ArrowUpRight, color: "#CB9615" },
  { label: "Years to Retire", value: "8 Years", change: "Age 50", icon: Clock, color: "#7B1FA2" },
];

const offlinePublications = [
  { title: "Annual Report 2025", type: "Annual Report", size: "4.2 MB", downloaded: true, date: "2026-03-15" },
  { title: "Q1 2026 Pension Industry Report", type: "Quarterly Report", size: "2.8 MB", downloaded: false, date: "2026-04-30" },
  { title: "Micro Pension Guidelines", type: "Guideline", size: "1.5 MB", downloaded: true, date: "2026-04-15" },
  { title: "Pension Reform Act 2014", type: "Legislation", size: "3.1 MB", downloaded: false, date: "2026-01-10" },
  { title: "Code of Corporate Governance", type: "Code", size: "2.2 MB", downloaded: true, date: "2025-11-20" },
];

const guidanceSteps = [
  {
    service: "How to Open an RSA",
    icon: UserPlus,
    color: "#117F21",
    steps: [
      "Choose a licensed PFA from the directory",
      "Visit the PFA with valid ID and BVN",
      "Complete the RSA enrollment form",
      "Receive your unique PIN and account number",
      "Start contributing to your retirement savings",
    ],
  },
  {
    service: "How to Transfer Your RSA",
    icon: ArrowRightLeft,
    color: "#1E88E5",
    steps: [
      "Choose a new licensed PFA",
      "Obtain the RSA Transfer Form (RTF)",
      "Complete and submit the form to your new PFA",
      "PenCom processes the transfer within 3-5 days",
      "Receive confirmation of successful transfer",
    ],
  },
  {
    service: "How to Access Benefits",
    icon: FileCheck,
    color: "#CB9615",
    steps: [
      "Confirm you have reached retirement age (50+)",
      "Submit retirement notification to your PFA",
      "Choose payment option (lump sum/programmed/annuity)",
      "Complete the benefit application form",
      "Receive your retirement benefits",
    ],
  },
  {
    service: "How to Apply for PCC",
    icon: FileCheck,
    color: "#7B1FA2",
    steps: [
      "Log in to your employer portal",
      "Complete the PCC application form",
      "Upload supporting documents",
      "Pay the processing fee",
      "Receive certificate within 5-10 working days",
    ],
  },
];

const mockNotifications = [
  { title: "Contribution Received", body: "Your employer remitted N125,000 for May 2026", time: "2h ago", type: "info", read: false },
  { title: "New Circular Published", body: "Updated Micro Pension Guidelines now available", time: "5h ago", type: "warning", read: false },
  { title: "RSA Transfer Approved", body: "Your transfer to ARM Pension is complete", time: "1d ago", type: "success", read: true },
  { title: "Pension Reform Update", body: "New amendments to the Pension Reform Act 2014", time: "2d ago", type: "critical", read: true },
  { title: "Verification Deadline", body: "Update your KYC with your PFA before Dec 31", time: "3d ago", type: "warning", read: false },
];

// =============================================================================
// BIOMETRIC AUTH SCREEN
// =============================================================================
function BiometricScreen({ onAuth }: { onAuth: () => void }) {
  const [showFallback, setShowFallback] = useState(false);
  const [pin, setPin] = useState("");

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#0A4A13] via-[#117F21] to-[#2E913D] text-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#CB9615]/10 rounded-full -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#B52026]/10 rounded-full translate-y-1/4 -translate-x-1/4" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur p-3">
          <img
            src="/pencom-logo.png"
            alt="PenCom"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold mb-1">PenCom Mobile</h1>
        <p className="text-sm text-white/70 mb-8">National Pension Commission</p>

        {!showFallback ? (
          <>
            <div className="flex gap-6 mb-8">
              <button
                onClick={onAuth}
                className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"
              >
                <Fingerprint className="w-10 h-10" />
                <span className="text-xs">Fingerprint</span>
              </button>
              <button
                onClick={onAuth}
                className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"
              >
                <Scan className="w-10 h-10" />
                <span className="text-xs">Face ID</span>
              </button>
            </div>
            <button
              onClick={() => setShowFallback(true)}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Use PIN instead
            </button>
          </>
        ) : (
          <div className="w-full max-w-xs">
            <p className="text-center text-sm text-white/70 mb-4">Enter your 4-digit PIN</p>
            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                    pin.length > i ? "border-white bg-white/20" : "border-white/30"
                  }`}
                >
                  {pin.length > i ? "*" : ""}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === "del") setPin((p) => p.slice(0, -1));
                    else if (key && pin.length < 4) {
                      const next = pin + key;
                      setPin(next);
                      if (next.length === 4) setTimeout(onAuth, 300);
                    }
                  }}
                  className={`h-12 rounded-xl text-lg font-medium transition-colors ${
                    key === "" ? "invisible" : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {key === "del" ? "<" : key}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setShowFallback(false); setPin(""); }}
              className="w-full mt-4 text-sm text-white/60 hover:text-white transition-colors text-center"
            >
              Back to Biometric
            </button>
          </div>
        )}

        <div className="mt-auto pt-6 text-center">
          <p className="text-[10px] text-white/40">Secured by PenCom Encryption</p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// DASHBOARD SCREEN (Feature 1)
// =============================================================================
function DashboardScreen({ onNavigate }: { onNavigate: (s: ScreenName) => void }) {
  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0A4A13] to-[#117F21] text-white px-4 pt-5 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src="/pencom-logo.png"
              alt="PenCom"
              className="w-8 h-8 rounded-lg object-contain bg-white/20"
            />
            <span className="font-bold text-sm">PenCom Mobile</span>
          </div>
          <button onClick={() => onNavigate("notifications")} className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B52026] rounded-full text-[9px] flex items-center justify-center font-bold">3</span>
          </button>
        </div>
        <p className="text-xs text-white/60 mb-0.5">Welcome back,</p>
        <p className="text-lg font-bold">Adebayo Johnson</p>
        <p className="text-xs text-white/50">PENCOM-7843921</p>
      </div>

      {/* Quick Tiles */}
      <div className="px-3 -mt-4">
        <div className="grid grid-cols-2 gap-2">
          {quickTiles.map((tile) => (
            <button
              key={tile.label}
              className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${tile.color}15` }}>
                  <tile.icon className="w-4 h-4" style={{ color: tile.color }} />
                </div>
                <span className="text-[10px] text-gray-400">{tile.change}</span>
              </div>
              <p className="text-base font-bold text-gray-900">{tile.value}</p>
              <p className="text-[10px] text-gray-500">{tile.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-3 mt-4">
        <p className="text-xs font-semibold text-gray-600 mb-2 px-1">Quick Actions</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Transfer", icon: ArrowRightLeft, screen: "guidance" as ScreenName, color: "#1E88E5" },
            { label: "PCC", icon: FileCheck, screen: "guidance" as ScreenName, color: "#7B1FA2" },
            { label: "Publications", icon: BookOpen, screen: "publications" as ScreenName, color: "#CB9615" },
            { label: "Find PFA", icon: Landmark, screen: "pfa" as ScreenName, color: "#117F21" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              className="flex flex-col items-center gap-1.5 p-2.5 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${item.color}12` }}>
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <span className="text-[9px] font-medium text-gray-600">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-3 mt-4 pb-4">
        <p className="text-xs font-semibold text-gray-600 mb-2 px-1">Recent Activity</p>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
          {[
            { action: "Contribution received", detail: "N125,000 from Federal Ministry", time: "2h ago", color: "#117F21" },
            { action: "New circular published", detail: "Micro Pension Guidelines 2026", time: "1d ago", color: "#CB9615" },
            { action: "RSA balance updated", detail: "Your PFA posted monthly returns", time: "2d ago", color: "#1E88E5" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}12` }}>
                <TrendingUp className="w-3.5 h-3.5" style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800">{item.action}</p>
                <p className="text-[10px] text-gray-500">{item.detail}</p>
              </div>
              <span className="text-[10px] text-gray-400 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PUBLICATIONS SCREEN (Feature 2)
// =============================================================================
function PublicationsScreen({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});

  const filtered = offlinePublications.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">
      <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-1 -ml-1"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="font-semibold text-gray-900">Publications</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search publications..."
            className="w-full bg-gray-100 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#117F21]"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.map((pub) => {
          const isDownloaded = downloaded[pub.title] ?? pub.downloaded;
          return (
            <div key={pub.title} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#CB9615]/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-[#CB9615]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{pub.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">{pub.type}</span>
                    <span className="text-[10px] text-gray-400">{pub.size}</span>
                    {isDownloaded && (
                      <span className="text-[10px] px-2 py-0.5 bg-[#E8F5E9] rounded-full text-[#117F21] flex items-center gap-1">
                        <WifiOff className="w-3 h-3" /> Offline
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setDownloaded((d) => ({ ...d, [pub.title]: !isDownloaded }))}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isDownloaded
                      ? "bg-[#E8F5E9] text-[#117F21]"
                      : "bg-[#117F21] text-white hover:bg-[#0A4A13]"
                  }`}
                >
                  {isDownloaded ? <CheckCircle className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  {isDownloaded ? "Downloaded" : "Download"}
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                  Read
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// PFA DIRECTORY SCREEN (Feature 3)
// =============================================================================
function PFAScreen({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [selectedPfa, setSelectedPfa] = useState<string | null>(null);

  const filtered = operators.filter(
    (o) => o.name.toLowerCase().includes(search.toLowerCase()) || o.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">
      <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-1 -ml-1"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="font-semibold text-gray-900">PFA Directory</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or city..."
            className="w-full bg-gray-100 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#117F21]"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.map((op) => (
          <div key={op.name} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setSelectedPfa(selectedPfa === op.name ? null : op.name)}
              className="w-full flex items-start gap-3 p-3.5 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-[#117F21]/10 flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5 text-[#117F21]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{op.name}</p>
                <p className="text-xs text-gray-500">{op.address}</p>
              </div>
              {selectedPfa === op.name ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
            </button>
            {selectedPfa === op.name && (
              <motion.div
                initial={{ height: 0 }} animate={{ height: "auto" }} className="border-t border-gray-50 px-3.5 pb-3.5 pt-2 space-y-2"
              >
                <div className="flex items-center gap-2 text-xs text-gray-600"><Phone className="w-3.5 h-3.5 text-[#117F21]" /> {op.phone}</div>
                <div className="flex items-center gap-2 text-xs text-gray-600"><MapPin className="w-3.5 h-3.5 text-[#B52026]" /> {op.address}, Nigeria</div>
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 py-1.5 bg-[#117F21] text-white rounded-lg text-xs font-medium">Call</button>
                  <button className="flex-1 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600">Get Directions</button>
                </div>
              </motion.div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center text-gray-500 text-sm py-8">No PFAs found</div>}
      </div>
    </div>
  );
}

// =============================================================================
// GUIDANCE SCREEN (Feature 4)
// =============================================================================
function GuidanceScreen({ onBack }: { onBack: () => void }) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">
      <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 -ml-1"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="font-semibold text-gray-900">Service Guide</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {guidanceSteps.map((guide, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center gap-3 p-3.5 text-left"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${guide.color}12` }}>
                <guide.icon className="w-5 h-5" style={{ color: guide.color }} />
              </div>
              <span className="flex-1 text-sm font-medium text-gray-900">{guide.service}</span>
              {expanded === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {expanded === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-gray-50 px-3.5 pb-3.5">
                <div className="relative pl-4 mt-3 space-y-4">
                  <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-200 rounded-full" />
                  {guide.steps.map((step, si) => (
                    <div key={si} className="relative flex items-start gap-3">
                      <div className="absolute -left-4 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 z-10" style={{ backgroundColor: guide.color }}>
                        {si + 1}
                      </div>
                      <p className="text-xs text-gray-600 ml-3 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// NOTIFICATIONS SCREEN (Feature 5)
// =============================================================================
function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const [notifs, setNotifs] = useState(mockNotifications);
  const markRead = (idx: number) => {
    setNotifs((prev) => prev.map((n, i) => (i === idx ? { ...n, read: true } : n)));
  };

  const typeColors: Record<string, string> = {
    critical: "bg-[#B52026]",
    warning: "bg-[#CB9615]",
    info: "bg-[#1E88E5]",
    success: "bg-[#117F21]",
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">
      <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0 flex items-center gap-3">
        <button onClick={onBack} className="p-1 -ml-1"><ChevronLeft className="w-5 h-5" /></button>
        <h2 className="font-semibold text-gray-900">Notifications</h2>
        <button
          onClick={() => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))}
          className="ml-auto text-xs text-[#117F21] font-medium"
        >
          Mark all read
        </button>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {notifs.map((n, i) => (
          <button key={i} onClick={() => markRead(i)} className={`w-full flex items-start gap-3 p-4 text-left ${!n.read ? "bg-blue-50/50" : "bg-white"}`}>
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? typeColors[n.type] : "bg-gray-200"}`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{n.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
              <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// FEEDBACK SCREEN (Feature 6)
// =============================================================================
function FeedbackScreen({ onBack }: { onBack: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState("complaint");
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">
      <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 -ml-1"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="font-semibold text-gray-900">Feedback & Complaints</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-[#117F21]" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Submitted!</h4>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">Your feedback has been received. PenCom will respond within 14 working days.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">Type</p>
              <div className="flex gap-2 flex-wrap">
                {["Complaint", "Suggestion", "Inquiry", "Report Employer"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t.toLowerCase())}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      type === t.toLowerCase() ? "bg-[#117F21] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Full Name</p>
                <input className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#117F21]" placeholder="Your name" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">RSA PIN</p>
                <input className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#117F21]" placeholder="PENCOM-XXXXXXX" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Description</p>
                <textarea
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#117F21] resize-none"
                  rows={4} placeholder="Describe your issue in detail..."
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Attach File (Optional)</p>
                <button className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:border-[#117F21] hover:text-[#117F21] transition-colors">
                  + Tap to upload document or photo
                </button>
              </div>
            </div>
            <button
              onClick={() => setSubmitted(true)}
              className="w-full py-3 bg-[#B52026] text-white rounded-xl text-sm font-semibold hover:bg-[#8E1A1E] transition-colors"
            >
              Submit {type === "report employer" ? "Report" : "Feedback"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// ACCESSIBILITY SCREEN (Feature 8)
// =============================================================================
function AccessibilityScreen({ onBack }: { onBack: () => void }) {
  const [fontSize, setFontSize] = useState(16);
  const [screenReader, setScreenReader] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [voiceNav, setVoiceNav] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">
      <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 -ml-1"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="font-semibold text-gray-900">Accessibility</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Screen Reader */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#117F21]/10 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-[#117F21]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Screen Reader</p>
              <p className="text-[10px] text-gray-500">Voice-over for all UI elements</p>
            </div>
          </div>
          <button
            onClick={() => setScreenReader(!screenReader)}
            className={`w-11 h-6 rounded-full transition-colors relative ${screenReader ? "bg-[#117F21]" : "bg-gray-300"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${screenReader ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>

        {/* Dynamic Text */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#1E88E5]/10 flex items-center justify-center">
              <Type className="w-5 h-5 text-[#1E88E5]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dynamic Text Size</p>
              <p className="text-[10px] text-gray-500">Adjust app-wide text size</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">A</span>
            <input
              type="range" min={12} max={24} value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="flex-1 accent-[#117F21]"
            />
            <span className="text-lg text-gray-400">A</span>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-1">{fontSize}px</p>
        </div>

        {/* High Contrast */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#B52026]/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#B52026]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">High Contrast</p>
              <p className="text-[10px] text-gray-500">Increase visual contrast</p>
            </div>
          </div>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`w-11 h-6 rounded-full transition-colors relative ${highContrast ? "bg-[#117F21]" : "bg-gray-300"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${highContrast ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>

        {/* Reduce Motion */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#CB9615]/10 flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-[#CB9615]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Reduce Motion</p>
              <p className="text-[10px] text-gray-500">Minimize animations</p>
            </div>
          </div>
          <button
            onClick={() => setReduceMotion(!reduceMotion)}
            className={`w-11 h-6 rounded-full transition-colors relative ${reduceMotion ? "bg-[#117F21]" : "bg-gray-300"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${reduceMotion ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>

        {/* Voice Navigation */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#7B1FA2]/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-[#7B1FA2]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Voice Navigation</p>
              <p className="text-[10px] text-gray-500">Navigate using voice commands</p>
            </div>
          </div>
          <button
            onClick={() => setVoiceNav(!voiceNav)}
            className={`w-11 h-6 rounded-full transition-colors relative ${voiceNav ? "bg-[#117F21]" : "bg-gray-300"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${voiceNav ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN MOBILE APP
// =============================================================================
export default function MobileApp() {
  const [screen, setScreen] = useState<ScreenName>("biometric");
  const [auth, setAuth] = useState(false);

  const handleAuth = () => {
    setAuth(true);
    setScreen(null);
  };

  const navigateTo = (s: ScreenName) => setScreen(s);
  const goHome = () => setScreen(null);

  const renderScreen = () => {
    switch (screen) {
      case "biometric": return <BiometricScreen onAuth={handleAuth} />;
      case "dashboard": return <DashboardScreen onNavigate={navigateTo} />;
      case "publications": return <PublicationsScreen onBack={goHome} />;
      case "pfa": return <PFAScreen onBack={goHome} />;
      case "guidance": return <GuidanceScreen onBack={goHome} />;
      case "notifications": return <NotificationsScreen onBack={goHome} />;
      case "feedback": return <FeedbackScreen onBack={goHome} />;
      case "accessibility": return <AccessibilityScreen onBack={goHome} />;
      default:
        return <DashboardScreen onNavigate={navigateTo} />;
    }
  };

  const tabs = [
    { key: "dashboard" as ScreenName, label: "Home", icon: Home },
    { key: "guidance" as ScreenName, label: "Guide", icon: LayoutGrid },
    { key: "feedback" as ScreenName, label: "Feedback", icon: MessageSquare },
    { key: "accessibility" as ScreenName, label: "A11y", icon: Accessibility },
    { key: "publications" as ScreenName, label: "Library", icon: BookOpen },
  ];

  const allFeatures = [
    { label: "Dashboard", icon: TrendingUp, screen: "dashboard" as ScreenName, color: "#117F21", desc: "Personalized tiles & RSA balance" },
    { label: "Publications", icon: BookOpen, screen: "publications" as ScreenName, color: "#CB9615", desc: "Offline circulars & reports" },
    { label: "PFA Directory", icon: Users, screen: "pfa" as ScreenName, color: "#1E88E5", desc: "Contact & location details" },
    { label: "Service Guide", icon: FileCheck, screen: "guidance" as ScreenName, color: "#7B1FA2", desc: "Step-by-step instructions" },
    { label: "Notifications", icon: Bell, screen: "notifications" as ScreenName, color: "#B52026", desc: "Push alerts for new content" },
    { label: "Feedback", icon: MessageSquare, screen: "feedback" as ScreenName, color: "#2E913D", desc: "Complaints & submissions" },
    { label: "Biometric", icon: Fingerprint, screen: "biometric" as ScreenName, color: "#117F21", desc: "Face ID & Fingerprint login" },
    { label: "Accessibility", icon: Accessibility, screen: "accessibility" as ScreenName, color: "#CB9615", desc: "Screen reader & text size" },
  ];

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 md:p-8">
      {/* Desktop Info */}
      <div className="hidden lg:flex flex-col items-center justify-center mr-12 max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#117F21] to-[#0A4A13] flex items-center justify-center mb-6">
          <Smartphone className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PenCom Mobile</h2>
        <p className="text-gray-500 text-center mb-6">
          A comprehensive mobile experience for pension management on the go.
        </p>
        <div className="space-y-2 w-full">
          {allFeatures.map((f) => (
            <button
              key={f.label}
              onClick={() => { setAuth(true); setScreen(f.screen); }}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all hover:bg-gray-50 border border-transparent hover:border-gray-200 ${screen === f.screen ? "bg-[#E8F5E9] border-[#117F21]/20" : ""}`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${f.color}12` }}>
                <f.icon className="w-4 h-4" style={{ color: f.color }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{f.label}</p>
                <p className="text-[10px] text-gray-400">{f.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Phone Frame */}
      <div className="relative w-full max-w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl border-8 border-gray-900 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-7 bg-gray-900 z-50 flex items-center justify-center">
          <div className="w-24 h-5 bg-black rounded-b-2xl" />
        </div>

        <div className="h-full pt-7 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen ?? "home"}
              initial={{ opacity: 0, x: screen ? 20 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tab Bar */}
        {auth && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-50">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setScreen(tab.key)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
                  screen === tab.key ? "text-[#117F21]" : "text-gray-400"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-[9px] font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900 rounded-full z-50" />
      </div>
    </div>
  );
}
