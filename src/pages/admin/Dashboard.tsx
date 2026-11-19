import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Landmark,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Download,
  Search,
  Eye,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { operators } from "@/lib/data";

const statsCards = [
  {
    label: "Total Contributors",
    value: "10,247,839",
    change: "+3.2%",
    up: true,
    icon: Users,
    color: "#117F21",
  },
  {
    label: "Total AUM (NGN)",
    value: "N20.5T",
    change: "+8.7%",
    up: true,
    icon: TrendingUp,
    color: "#1E88E5",
  },
  {
    label: "Licensed PFAs",
    value: "22",
    change: "0",
    up: true,
    icon: Landmark,
    color: "#CB9615",
  },
  {
    label: "Pending Reports",
    value: "147",
    change: "+12",
    up: false,
    icon: AlertTriangle,
    color: "#B52026",
  },
  {
    label: "PCC Applications",
    value: "2,341",
    change: "+18%",
    up: true,
    icon: FileCheck,
    color: "#7B1FA2",
  },
  {
    label: "RSA Transfers (MTD)",
    value: "4,892",
    change: "+6.4%",
    up: true,
    icon: Activity,
    color: "#2E913D",
  },
];

const recentReports = [
  {
    id: "RPT-2026-0541",
    reporter: "Adebayo Johnson",
    employer: "XYZ Logistics Ltd",
    type: "Non-remittance",
    date: "2026-05-20",
    status: "pending",
  },
  {
    id: "RPT-2026-0540",
    reporter: "Fatima Bello",
    employer: "ABC Manufacturing",
    type: "Under-remittance",
    date: "2026-05-19",
    status: "investigating",
  },
  {
    id: "RPT-2026-0539",
    reporter: "Emeka Okafor",
    employer: "Sunrise Technologies",
    type: "Non-remittance",
    date: "2026-05-18",
    status: "resolved",
  },
  {
    id: "RPT-2026-0538",
    reporter: "Amina Ibrahim",
    employer: "Coastal Services Ltd",
    type: "Delayed remittance",
    date: "2026-05-17",
    status: "pending",
  },
  {
    id: "RPT-2026-0537",
    reporter: "Tunde Williams",
    employer: "Peak Pharmaceuticals",
    type: "Under-remittance",
    date: "2026-05-16",
    status: "investigating",
  },
];

const pfaPerformance = [
  { name: "AIICO Pension", aum: "N2.1T", returnYTD: "+12.4%", contributors: "1.2M" },
  { name: "ARM Pension", aum: "N1.8T", returnYTD: "+11.8%", contributors: "980K" },
  { name: "Stanbic IBTC", aum: "N1.6T", returnYTD: "+13.1%", contributors: "850K" },
  { name: "Trustfund", aum: "N1.4T", returnYTD: "+10.9%", contributors: "720K" },
  { name: "Premium Pension", aum: "N1.2T", returnYTD: "+11.2%", contributors: "650K" },
];

const recentActivity = [
  { action: "New employer registered", detail: "Greenfield Industries Ltd", time: "5 min ago" },
  { action: "PCC issued", detail: "Certificate #PCC-2026-00892", time: "12 min ago" },
  { action: "RSA transfer completed", detail: "PIN: PENCOM-7843921", time: "28 min ago" },
  { action: "Report assigned", detail: "RPT-2026-0541 to Officer Ade", time: "45 min ago" },
  { action: "New circular published", detail: "Guidelines on Micro Pension", time: "1 hour ago" },
  { action: "PFA audit submitted", detail: "AIICO Pension Q1 2026", time: "2 hours ago" },
];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    investigating: "bg-blue-100 text-blue-800 border-blue-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
};

const statusIcon = (status: string) => {
  if (status === "resolved") return <CheckCircle className="w-3.5 h-3.5 mr-1" />;
  if (status === "investigating") return <Clock className="w-3.5 h-3.5 mr-1" />;
  return <Eye className="w-3.5 h-3.5 mr-1" />;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "reports" | "operators" | "analytics">("overview");
  const [reportFilter, setReportFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = recentReports.filter((r) => {
    if (reportFilter !== "all" && r.status !== reportFilter) return false;
    if (searchQuery && !r.employer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#117F21] to-[#0A4A13] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">PenCom Admin</h1>
                <p className="text-[10px] text-gray-500 leading-tight">Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full text-xs text-green-700">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                System Online
              </div>
              <div className="w-9 h-9 rounded-full bg-[#117F21]/10 flex items-center justify-center text-sm font-bold text-[#117F21]">
                AD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {[
              { key: "overview" as const, label: "Overview", icon: PieChartIcon },
              { key: "reports" as const, label: "Reports", icon: AlertTriangle },
              { key: "operators" as const, label: "Operators", icon: Landmark },
              { key: "analytics" as const, label: "Analytics", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? "bg-[#117F21] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              {statsCards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}12` }}
                    >
                      <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
                    </div>
                    <span
                      className={`flex items-center text-xs font-medium ${
                        stat.up ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.up ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Reports */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Recent Employer Reports</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-[#117F21] text-[#117F21] hover:bg-[#117F21] hover:text-white"
                      onClick={() => setActiveTab("reports")}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="text-left px-5 py-3 font-medium">Report ID</th>
                          <th className="text-left px-5 py-3 font-medium">Employer</th>
                          <th className="text-left px-5 py-3 font-medium">Type</th>
                          <th className="text-left px-5 py-3 font-medium">Date</th>
                          <th className="text-left px-5 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {recentReports.slice(0, 4).map((report) => (
                          <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3 font-mono text-xs text-gray-500">{report.id}</td>
                            <td className="px-5 py-3 font-medium text-gray-900">{report.employer}</td>
                            <td className="px-5 py-3 text-gray-600">{report.type}</td>
                            <td className="px-5 py-3 text-gray-500">{report.date}</td>
                            <td className="px-5 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge(report.status)}`}
                              >
                                {statusIcon(report.status)}
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Recent Activity</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                        <p className="text-sm font-medium text-gray-800">{item.action}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* PFA Performance Table */}
            <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Top PFAs by AUM</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-[#117F21] text-[#117F21] hover:bg-[#117F21] hover:text-white"
                  onClick={() => setActiveTab("operators")}
                >
                  View All
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-5 py-3 font-medium">PFA Name</th>
                      <th className="text-left px-5 py-3 font-medium">AUM</th>
                      <th className="text-left px-5 py-3 font-medium">Return YTD</th>
                      <th className="text-left px-5 py-3 font-medium">Contributors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pfaPerformance.map((pfa) => (
                      <tr key={pfa.name} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 font-medium text-gray-900">{pfa.name}</td>
                        <td className="px-5 py-3 text-gray-700">{pfa.aum}</td>
                        <td className="px-5 py-3 text-green-600 font-medium">{pfa.returnYTD}</td>
                        <td className="px-5 py-3 text-gray-600">{pfa.contributors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by employer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-200"
                />
              </div>
              <div className="flex gap-2">
                {["all", "pending", "investigating", "resolved"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setReportFilter(f)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                      reportFilter === f
                        ? "bg-[#117F21] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-5 py-3 font-medium">Report ID</th>
                      <th className="text-left px-5 py-3 font-medium">Reporter</th>
                      <th className="text-left px-5 py-3 font-medium">Employer</th>
                      <th className="text-left px-5 py-3 font-medium">Type</th>
                      <th className="text-left px-5 py-3 font-medium">Date</th>
                      <th className="text-left px-5 py-3 font-medium">Status</th>
                      <th className="text-left px-5 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-gray-500">{report.id}</td>
                        <td className="px-5 py-3 text-gray-700">{report.reporter}</td>
                        <td className="px-5 py-3 font-medium text-gray-900">{report.employer}</td>
                        <td className="px-5 py-3 text-gray-600">{report.type}</td>
                        <td className="px-5 py-3 text-gray-500">{report.date}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge(report.status)}`}
                          >
                            {statusIcon(report.status)}
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <Button variant="ghost" size="sm" className="text-xs text-[#117F21] hover:text-[#0A4A13]">
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredReports.length === 0 && (
                <div className="text-center py-12 text-gray-500">No reports found matching your criteria.</div>
              )}
            </div>
          </motion.div>
        )}

        {/* OPERATORS TAB */}
        {activeTab === "operators" && (
          <motion.div
            key="operators"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search PFA/PFC..." className="pl-9 border-gray-200" />
              </div>
              <Button className="bg-[#117F21] hover:bg-[#0A4A13] text-white ml-3">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="grid gap-4">
              {operators.map((op, i) => (
                <motion.div
                  key={op.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#117F21]/10 to-[#CB9615]/10 flex items-center justify-center shrink-0">
                    <Landmark className="w-5 h-5 text-[#117F21]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{op.name}</h3>
                    <p className="text-xs text-gray-500">{op.address} &middot; {op.phone}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full shrink-0">
                    {op.type}
                  </span>
                  <Button variant="ghost" size="sm" className="shrink-0 text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Chart Placeholder 1 */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Asset Under Management Growth</h3>
                <div className="h-48 flex items-end gap-2">
                  {[35, 42, 48, 55, 62, 70, 78, 85, 92, 100, 108, 115].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-sm bg-gradient-to-t from-[#117F21] to-[#2E913D] opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${h * 1.5}px` }}
                      />
                      <span className="text-[9px] text-gray-400">
                        {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>Jan 2026</span>
                  <span className="text-green-600 font-medium">+8.7% YoY</span>
                  <span>Dec 2026</span>
                </div>
              </div>

              {/* Chart Placeholder 2 */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Contributor Registration Trend</h3>
                <div className="h-48 flex items-end gap-2">
                  {[50, 55, 58, 62, 68, 75, 82, 88, 92, 95, 98, 102].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-sm bg-gradient-to-t from-[#1E88E5] to-[#42A5F5] opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${h * 1.3}px` }}
                      />
                      <span className="text-[9px] text-gray-400">
                        {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>Jan 2026</span>
                  <span className="text-blue-600 font-medium">+3.2% YoY</span>
                  <span>Dec 2026</span>
                </div>
              </div>
            </div>

            {/* Distribution Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#117F21]/10 flex items-center justify-center mb-3">
                  <Users className="w-8 h-8 text-[#117F21]" />
                </div>
                <p className="text-3xl font-bold text-gray-900">8.4M</p>
                <p className="text-sm text-gray-500">Active Contributors</p>
                <p className="text-xs text-green-600 mt-1">82% of total registered</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#CB9615]/10 flex items-center justify-center mb-3">
                  <Landmark className="w-8 h-8 text-[#CB9615]" />
                </div>
                <p className="text-3xl font-bold text-gray-900">N14.2T</p>
                <p className="text-sm text-gray-500">RSA Fund I-III</p>
                <p className="text-xs text-green-600 mt-1">69% of total AUM</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#1E88E5]/10 flex items-center justify-center mb-3">
                  <FileCheck className="w-8 h-8 text-[#1E88E5]" />
                </div>
                <p className="text-3xl font-bold text-gray-900">12,847</p>
                <p className="text-sm text-gray-500">PCCs Issued YTD</p>
                <p className="text-xs text-green-600 mt-1">+23% vs last year</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
