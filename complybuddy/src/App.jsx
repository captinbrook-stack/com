import React, { useMemo, useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, CheckSquare, FileText, ShieldAlert, Settings, BarChart3,
  PlayCircle, ListChecks, ClipboardCheck, PlusCircle, Search, Filter,
  Download, ChevronRight, User, Bell, KeyRound
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
} from "recharts";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

// ---- Mock API for Data Fetching ----
// In a real app, this would be in a separate file and make actual network requests.
const riskRowsDB = [
  { id: 1, asset: "Customer DB", threat: "Ransomware", vuln: "Unpatched OS", impact: "High", likelihood: "Medium", status: "Open" },
  { id: 2, asset: "Payroll App", threat: "Credential Stuffing", vuln: "Weak MFA", impact: "Medium", likelihood: "High", status: "Mitigation in progress" },
  { id: 3, asset: "S3 Bucket", threat: "Data Leak", vuln: "Public ACL", impact: "High", likelihood: "Low", status: "Closed" },
];

const fetchRisks = async () => {
  console.log("API: Fetching risks...");
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  console.log("API: Fetched risks successfully.");
  return [...riskRowsDB]; // Return a copy to prevent mutation
};

const addRisk = async (newRisk) => {
  console.log("API: Adding new risk...", newRisk);
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  const riskToAdd = {
    id: Math.max(0, ...riskRowsDB.map(r => r.id)) + 1,
    ...newRisk,
    status: "Open",
  };
  riskRowsDB.push(riskToAdd);
  console.log("API: Risk added successfully.");
  return riskToAdd;
};

// ---- Mock shadcn/ui Components ----
// These are simplified versions to make the code runnable without the actual library.
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
    const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    const variants = {
        default: "bg-indigo-600 text-white hover:bg-indigo-600/90",
        destructive: "bg-red-500 text-white hover:bg-red-500/90",
        outline: "border border-input hover:bg-slate-100",
        secondary: "bg-slate-200 text-slate-800 hover:bg-slate-200/80",
        ghost: "hover:bg-slate-100",
    };
    const sizes = { default: "h-10 py-2 px-4", sm: "h-9 px-3 rounded-md", icon: "h-10 w-10" };
    return <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};
const Card = ({ className, children }) => <div className={`rounded-2xl border bg-white text-card-foreground shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children }) => <div className="flex flex-col space-y-1.5 p-6">{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardDescription = ({ children }) => <p className="text-sm text-slate-500">{children}</p>;
const CardContent = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const CardFooter = ({ children }) => <div className="flex items-center p-6 pt-0">{children}</div>;
const Input = (props) => <input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...props} />;
const Label = (props) => <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props} />;
const Badge = ({ children, variant = 'default', className }) => {
    const variants = {
        default: "bg-emerald-500 text-white",
        secondary: "bg-amber-400 text-black",
        destructive: "bg-red-500 text-white",
        outline: "border"
    };
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>{children}</span>;
};
const Progress = ({ value }) => <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200"><div className="h-full w-full flex-1 bg-indigo-600 transition-all" style={{ transform: `translateX(-${100 - (value || 0)}%)` }}></div></div>;
const SelectContext = createContext({});
const Select = ({ children, value, onValueChange }) => <SelectContext.Provider value={{ value, onValueChange }}>{children}</SelectContext.Provider>;
const SelectTrigger = ({ children, className }) => <button className={`flex h-10 items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full ${className}`}>{children}</button>;
const SelectValue = ({ placeholder }) => { const { value } = useContext(SelectContext); return <span>{value || placeholder}</span>; };
const SelectContent = ({ children }) => <div className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">{children}</div>;
const SelectItem = ({ children, value }) => { const { onValueChange } = useContext(SelectContext); return <div className="text-sm p-2 cursor-pointer hover:bg-slate-100" onClick={() => onValueChange(value)}>{children}</div>; };
const Textarea = (props) => <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...props} />;
const Separator = () => <hr className="my-4" />;
const Table = ({ children }) => <div className="w-full text-sm">{children}</div>;
const TableHeader = ({ children }) => <div>{children}</div>;
const TableRow = ({ children }) => <div className="flex border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">{children}</div>;
const TableHead = ({ children, className }) => <div className={`flex-1 p-4 font-medium text-left text-slate-600 ${className}`}>{children}</div>;
const TableBody = ({ children }) => <div>{children}</div>;
const TableCell = ({ children, className }) => <div className={`flex-1 p-4 ${className}`}>{children}</div>;
const Checkbox = (props) => <input type="checkbox" className="h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...props} />;
const Avatar = ({ children, className }) => <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>;
const AvatarFallback = ({ children }) => <span className="flex h-full w-full items-center justify-center rounded-full bg-slate-200">{children}</span>;

// ---- App Data ----
const frameworks = [
  { code: "ISO27001", name: "ISO/IEC 27001" }, { code: "PCI", name: "PCI DSS v4.0" },
  { code: "GDPR", name: "GDPR" }, { code: "HIPAA", name: "HIPAA" },
];
const complianceSummary = [
  { framework: "ISO/IEC 27001", percent: 62 }, { framework: "PCI DSS v4.0", percent: 78 },
  { framework: "GDPR", percent: 55 },
];
const donutData = [
  { name: "Compliant", value: 58, color: "#10b981" },
  { name: "In Progress", value: 27, color: "#f59e0b" },
  { name: "Gaps", value: 15, color: "#ef4444" },
];
const statusColor = {
  Open: "bg-red-100 text-red-700", "Mitigation in progress": "bg-amber-100 text-amber-800",
  Closed: "bg-emerald-100 text-emerald-700",
};

// ---- UI Animation Variants ----
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } } };

// ---- Page Components ----
function Header({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden"><ChevronRight className="h-5 w-5" /></Button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow"><ShieldCheck className="h-5 w-5" /></div>
            <div className="font-semibold">ComplyEase</div>
            <Badge variant="secondary" className="rounded-full">AI</Badge>
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search controls, risks, reports…" className="pl-9 w-[320px] rounded-2xl" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full"><Bell className="h-5 w-5" /></Button>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar className="h-8 w-8"><AvatarFallback>AS</AvatarFallback></Avatar>
            <span className="text-sm font-medium hidden sm:inline">A. Sharma</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Sidebar({ current, setCurrent, open }) {
  const nav = [
    { key: "dashboard", label: "Dashboard", icon: BarChart3 }, { key: "checklists", label: "Checklist Generator", icon: ListChecks },
    { key: "risks", label: "Risk Register", icon: ShieldAlert }, { key: "reports", label: "Reports", icon: FileText },
    { key: "settings", label: "Settings", icon: Settings },
  ];
  return (
    <aside className={`fixed inset-y-16 left-0 z-30 w-72 border-r bg-white p-4 transition-transform md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <nav className="flex flex-col gap-1">
        {nav.map((n) => {
          const Icon = n.icon; const active = current === n.key;
          return <Button key={n.key} variant={active ? "default" : "ghost"} className={`justify-start gap-3 rounded-xl ${active ? "bg-indigo-600 text-white hover:bg-indigo-600" : ""}`} onClick={() => setCurrent(n.key)}><Icon className="h-5 w-5" /> {n.label}</Button>;
        })}
      </nav>
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-4 text-white shadow">
        <div className="text-sm opacity-90">Audit Readiness</div>
        <div className="mt-1 text-2xl font-semibold">You're 72% there</div>
        <Progress value={72} className="mt-3 h-2" />
        <Button size="sm" variant="secondary" className="mt-4 w-full rounded-xl">View Gaps</Button>
      </div>
    </aside>
  );
}

function Dashboard({ setCurrent }) {
  const quickActions = [
      { label: "Generate Checklist", icon: CheckSquare, target: "checklists" },
      { label: "Run Gap Analysis", icon: ShieldAlert, target: "risks" },
      { label: "Create Risk", icon: PlusCircle, target: "risks" },
      { label: "Export Report", icon: Download, target: "reports" },
  ];

  return (
    <div className="space-y-6">
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {complianceSummary.map((c) => (
          <motion.div variants={item} key={c.framework}>
            <Card>
              <CardHeader><CardTitle className="flex items-center justify-between text-lg"><span>{c.framework}</span><Badge variant={c.percent >= 75 ? "default" : c.percent >= 60 ? "secondary" : "destructive"}>{c.percent}%</Badge></CardTitle><CardDescription>Overall control coverage</CardDescription></CardHeader>
              <CardContent><Progress value={c.percent} className="h-2" /><div className="mt-3 text-sm text-slate-500">Keep pushing! Close remaining gaps to reach 100%.</div></CardContent>
              <CardFooter><Button variant="outline" size="sm" className="rounded-xl">View controls</Button></CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5"/> Compliance by Domain</CardTitle><CardDescription>Top-level view across domains/categories</CardDescription></CardHeader>
          <CardContent className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{ name: "Access", v: 82 }, { name: "Asset", v: 71 }, { name: "Crypto", v: 63 }, { name: "Ops", v: 58 }] }><XAxis dataKey="name" tickLine={false} axisLine={false} /><YAxis hide /><Tooltip /><Bar dataKey="v" radius={[8,8,0,0]} fill="#4f46e5" /></BarChart></ResponsiveContainer></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5"/> Overall Status</CardTitle><CardDescription>Compliant vs In progress vs Gaps</CardDescription></CardHeader>
          <CardContent className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={donutData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={80} paddingAngle={4}>{donutData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><PlayCircle className="h-5 w-5"/> Quick Actions</CardTitle><CardDescription>Get work done faster</CardDescription></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((a) => { 
                const Icon = a.icon; 
                return (
                    <Button 
                        key={a.label} 
                        variant="outline" 
                        className="justify-start gap-2 rounded-xl"
                        onClick={() => setCurrent(a.target)}
                    >
                        <Icon className="h-5 w-5" /> {a.label}
                    </Button>
                );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ChecklistGenerator() {
    return <Card><CardHeader><CardTitle>Checklist Generator</CardTitle><CardDescription>This feature is in development.</CardDescription></CardHeader></Card>;
}

function RiskRegister() {
  const [q, setQ] = useState("");
  const queryClient = useQueryClient();

  const { data: rows, isLoading, isError, error } = useQuery({
    queryKey: ['risks'],
    queryFn: fetchRisks,
  });

  const addRiskMutation = useMutation({
    mutationFn: addRisk,
    onSuccess: () => {
      console.log("Mutation successful, invalidating 'risks' query.");
      queryClient.invalidateQueries({ queryKey: ['risks'] });
    },
  });

  const filtered = useMemo(() => (rows || []).filter(r => 
    Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase())
  ), [rows, q]);

  const handleAddNewRisk = () => {
    addRiskMutation.mutate({
        asset: "New Web Server", threat: "SQL Injection", vuln: "Input validation missing",
        impact: "High", likelihood: "High",
    });
  };

  const handleExportCSV = () => {
    if (!rows || rows.length === 0) {
        console.log("No data to export.");
        return;
    }
    const headers = "ID,Asset,Threat,Vulnerability,Impact,Likelihood,Status\n";
    const csvContent = rows.map(r => 
        `${r.id},"${r.asset}","${r.threat}","${r.vuln}",${r.impact},${r.likelihood},${r.status}`
    ).join("\n");

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "risk_register.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Risk Register</CardTitle>
          <CardDescription>Track risks with simple filters and export. Data is now live!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search risks..." className="pl-9 rounded-xl" />
            </div>
            <Button className="rounded-xl" onClick={handleAddNewRisk} disabled={addRiskMutation.isPending}>
              <PlusCircle className="mr-2 h-4 w-4"/>
              {addRiskMutation.isPending ? 'Adding Risk...' : 'Add New Risk'}
            </Button>
            <Button variant="outline" className="rounded-xl ml-auto" onClick={handleExportCSV} disabled={!rows || rows.length === 0}>
                <Download className="mr-2 h-4 w-4"/> Export CSV
            </Button>
          </div>
          <div className="rounded-xl border">
            {isLoading && <div className="p-8 text-center text-slate-500">Loading live risk data...</div>}
            {isError && <div className="p-8 text-center text-red-600">Error fetching data: {error.message}</div>}
            {rows && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead><TableHead>Asset</TableHead><TableHead>Threat</TableHead>
                    <TableHead>Vulnerability</TableHead><TableHead>Impact</TableHead><TableHead>Likelihood</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell><Checkbox /></TableCell><TableCell className="font-medium">{r.asset}</TableCell>
                      <TableCell>{r.threat}</TableCell><TableCell>{r.vuln}</TableCell>
                      <TableCell><Badge variant={r.impact === "High" ? "destructive" : r.impact === "Medium" ? "secondary" : "outline"}>{r.impact}</Badge></TableCell>
                      <TableCell>{r.likelihood}</TableCell>
                      <TableCell><span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColor[r.status]}`}>{r.status}</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Reports() {
    return <Card><CardHeader><CardTitle>Reports</CardTitle><CardDescription>This feature is in development.</CardDescription></CardHeader></Card>;
}

function SettingsPage() {
    return <Card><CardHeader><CardTitle>Settings</CardTitle><CardDescription>This feature is in development.</CardDescription></CardHeader></Card>;
}

// ---- Main App Component ----
function ComplianceAppInternal() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [current, setCurrent] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* The fixed sidebar is a sibling to the main content wrapper */}
      <Sidebar current={current} setCurrent={setCurrent} open={sidebarOpen} />
      
      {/* This wrapper contains the header and main content.
          On medium screens and up, it has left padding equal to the sidebar's width. */}
      <div className="md:pl-72">
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="px-4 pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              className="pb-12"
            >
              {current === "dashboard" && <Dashboard setCurrent={setCurrent} />}
              {current === "checklists" && <ChecklistGenerator />}
              {current === "risks" && <RiskRegister />}
              {current === "reports" && <Reports />}
              {current === "settings" && <SettingsPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ComplianceAppInternal />
    </QueryClientProvider>
  );
}
