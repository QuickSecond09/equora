import React, { useState, useEffect, useRef } from 'react';
import { InequalityReport, ReportCategory } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  EyeOff,
  UserCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Upload,
  Camera,
  Search,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Lock,
  Globe,
  Tag,
  Building,
  Calendar,
  X,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';

const CATEGORIES: ReportCategory[] = [
  'Classroom & Textbooks',
  'School Athletics & Sports',
  'Workplace & Wage Parity',
  'Leadership & Civic Spaces',
  'Online Harassment & Digital Spaces',
  'Media & Cultural Representation',
  'Public Facilities & Transit',
  'Other',
];

export const ReportPage: React.FC = () => {
  // Mode: anonymous vs identified
  const [reportType, setReportType] = useState<'anonymous' | 'identified'>('anonymous');

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportCategory>('Classroom & Textbooks');
  const [incidentDate, setIncidentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [countryOrRegion, setCountryOrRegion] = useState('Global / International');
  const [institutionOrLocation, setInstitutionOrLocation] = useState('');
  const [description, setDescription] = useState('');
  const [impactObserved, setImpactObserved] = useState('');
  const [isPublicInLedger, setIsPublicInLedger] = useState(true);

  // Identified mode fields
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterRole, setReporterRole] = useState<'Student' | 'Educator' | 'Parent' | 'Employee' | 'Researcher' | 'Community Advocate' | 'Other'>('Student');

  // Evidence state
  const [evidenceImage, setEvidenceImage] = useState<string | null>(null);
  const [evidenceName, setEvidenceName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<InequalityReport | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Community Feed State
  const [communityReports, setCommunityReports] = useState<InequalityReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [feedCategory, setFeedCategory] = useState<string>('All');
  const [feedSearch, setFeedSearch] = useState('');
  const [selectedFeedItem, setSelectedFeedItem] = useState<InequalityReport | null>(null);

  // Tracking Code Lookup
  const [searchTrackingCode, setSearchTrackingCode] = useState('');
  const [trackedReport, setTrackedReport] = useState<InequalityReport | null>(null);
  const [trackingLookupError, setTrackingLookupError] = useState<string | null>(null);
  const [isSearchingTracking, setIsSearchingTracking] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'submit' | 'ledger' | 'lookup'>('submit');

  // Load community feed
  const fetchCommunityReports = async () => {
    setIsLoadingReports(true);
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.reports)) {
          setCommunityReports(data.reports);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch community reports:', err);
    } finally {
      setIsLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchCommunityReports();
  }, []);



  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEvidenceName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setEvidenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please provide a title and detailed description of the incident.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        isAnonymous: reportType === 'anonymous',
        reporterName: reportType === 'anonymous' ? undefined : reporterName,
        reporterEmail: reportType === 'anonymous' ? undefined : reporterEmail,
        reporterRole: reportType === 'anonymous' ? undefined : reporterRole,
        title: title.trim(),
        category,
        incidentDate,
        countryOrRegion,
        institutionOrLocation: institutionOrLocation.trim() || undefined,
        description: description.trim(),
        impactObserved: impactObserved.trim() || undefined,
        evidenceAttachment: evidenceName || undefined,
        evidenceImageUrl: evidenceImage || undefined,
        isPublicInLedger,
      };

      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to submit report. Please check your connection.');
      }

      const data = await res.json();
      setSubmitSuccess(data.report);

      // Save to localStorage as a tracked report for convenience
      try {
        const existing = JSON.parse(localStorage.getItem('equora_my_reports') || '[]');
        existing.unshift(data.report);
        localStorage.setItem('equora_my_reports', JSON.stringify(existing.slice(0, 20)));
      } catch (_e) {}

      // Refresh feed
      fetchCommunityReports();
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while filing the report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setImpactObserved('');
    setInstitutionOrLocation('');
    setEvidenceImage(null);
    setEvidenceName(null);
    setSubmitSuccess(null);
    setErrorMessage(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSearchTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackingCode.trim()) return;

    setIsSearchingTracking(true);
    setTrackingLookupError(null);
    setTrackedReport(null);

    try {
      const code = searchTrackingCode.trim().toUpperCase();
      const res = await fetch(`/api/reports/${encodeURIComponent(code)}`);
      if (!res.ok) {
        throw new Error('No incident found matching this tracking code. Please verify the code (e.g. EQ-REP-2024-8142).');
      }
      const data = await res.json();
      setTrackedReport(data.report);
    } catch (err: any) {
      setTrackingLookupError(err.message || 'Error looking up report.');
    } finally {
      setIsSearchingTracking(false);
    }
  };

  const filteredFeed = communityReports.filter((item) => {
    const matchesCat = feedCategory === 'All' || item.category === feedCategory;
    const matchesQ =
      !feedSearch.trim() ||
      item.title.toLowerCase().includes(feedSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(feedSearch.toLowerCase()) ||
      item.countryOrRegion.toLowerCase().includes(feedSearch.toLowerCase()) ||
      (item.institutionOrLocation && item.institutionOrLocation.toLowerCase().includes(feedSearch.toLowerCase()));
    return matchesCat && matchesQ;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[#2563EB] mb-1.5 font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#2563EB]" />
            <span>Advocacy & Accountability Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0D192E] tracking-tight">
            Report Gender Inequality
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Document instances of unequal treatment, textbook stereotyping, workplace discrimination, or athletic disparity. You can file <strong>completely anonymously</strong> or <strong>with verified contact information</strong> for follow-up and pedagogical auditing.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xs">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'submit'
                ? 'bg-[#0D192E] text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            File a Report
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'bg-[#0D192E] text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            <span>Community Feed</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-800 font-mono">
              {communityReports.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('lookup')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'lookup'
                ? 'bg-[#0D192E] text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            Track by Code
          </button>
        </div>
      </div>

      {/* TAB 1: FILE A REPORT */}
      {activeTab === 'submit' && (
        <div className="space-y-8 animate-fade-in">
          {submitSuccess ? (
            /* Submission Confirmation Card */
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-semibold">
                  Report Officially Cataloged
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D192E]">
                  Thank you for taking a stand.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your documentation has been assigned a secure tracking identifier and submitted to the EQUORA pedagogical review board.
                </p>
              </div>

              {/* Tracking Code Box */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-slate-200 max-w-md mx-auto space-y-2">
                <span className="text-[11px] text-slate-500 uppercase font-mono">Your Confidential Tracking Code</span>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg sm:text-xl font-mono font-bold text-[#0D192E] tracking-wider">
                    {submitSuccess.trackingCode}
                  </span>
                  <button
                    onClick={() => handleCopyCode(submitSuccess.trackingCode)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                    title="Copy Tracking Code"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Save this code to look up status updates or verification notes anytime.
                </p>
              </div>

              {/* Status info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Filing Mode</div>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {submitSuccess.isAnonymous ? '100% Anonymous' : 'Identified'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Category</div>
                  <div className="font-semibold text-slate-900 mt-0.5 truncate">{submitSuccess.category}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Initial Status</div>
                  <div className="font-semibold text-emerald-600 mt-0.5">{submitSuccess.status}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setActiveTab('ledger')}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#0D192E] hover:bg-[#1E293B] rounded-xl shadow-xs transition-colors"
                >
                  View in Community Ledger
                </button>
                <button
                  onClick={handleResetForm}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                >
                  Submit Another Report
                </button>
              </div>
            </div>
          ) : (
            /* Report Form Container */
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Anonymous vs Identified Switcher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Anonymous Card */}
                <button
                  type="button"
                  onClick={() => setReportType('anonymous')}
                  className={`text-left p-5 rounded-3xl border transition-all relative ${
                    reportType === 'anonymous'
                      ? 'bg-white border-[#2563EB] shadow-md ring-2 ring-[#2563EB]/20'
                      : 'bg-white/70 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3">
                      <EyeOff className="w-5 h-5" />
                    </div>
                    {reportType === 'anonymous' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2563EB] text-white">
                        Selected
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#0D192E]">Report Anonymously</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Zero name, email, or account linkage. Your report is cataloged strictly by an encrypted tracking code.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Complete Identity Shield Active</span>
                  </div>
                </button>

                {/* Identified Card */}
                <button
                  type="button"
                  onClick={() => setReportType('identified')}
                  className={`text-left p-5 rounded-3xl border transition-all relative ${
                    reportType === 'identified'
                      ? 'bg-white border-[#2563EB] shadow-md ring-2 ring-[#2563EB]/20'
                      : 'bg-white/70 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#F97059] flex items-center justify-center mb-3">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    {reportType === 'identified' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2563EB] text-white">
                        Selected
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#0D192E]">Report with Information</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Share your name, email, and community role for direct verification and curriculum audit follow-ups.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                    <Building className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Enables Educational Case-Study Partnership</span>
                  </div>
                </button>
              </div>

              {/* Form Body */}
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6"
              >
                {errorMessage && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Identified fields if chosen */}
                {reportType === 'identified' && (
                  <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0D192E]">
                      <UserCheck className="w-4 h-4 text-[#2563EB]" />
                      <span>Reporter Contact Information</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Full Name or Pseudonym
                        </label>
                        <input
                          type="text"
                          required
                          value={reporterName}
                          onChange={(e) => setReporterName(e.target.value)}
                          placeholder="e.g. Dr. Arthur Chen"
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          required
                          value={reporterEmail}
                          onChange={(e) => setReporterEmail(e.target.value)}
                          placeholder="e.g. educator@equora.edu"
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Your Role / Perspective
                        </label>
                        <select
                          value={reporterRole}
                          onChange={(e) => setReporterRole(e.target.value as any)}
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                        >
                          <option value="Student">Student</option>
                          <option value="Educator">Educator / Teacher</option>
                          <option value="Parent">Parent / Guardian</option>
                          <option value="Employee">Employee / Worker</option>
                          <option value="Researcher">Academic Researcher</option>
                          <option value="Community Advocate">Community Advocate</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Incident Title */}
                <div>
                  <label className="block text-xs font-semibold text-[#0D192E] mb-1.5">
                    Incident Title or Summary Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. High school chemistry lab equipment restricted solely to male students"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-slate-200 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 font-medium"
                  />
                </div>

                {/* Category & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0D192E] mb-1.5">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ReportCategory)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-slate-200 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0D192E] mb-1.5">
                      Approximate Date of Incident
                    </label>
                    <input
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-slate-200 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                  </div>
                </div>

                {/* Location & Institution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0D192E] mb-1.5">
                      Country or Geographic Region
                    </label>
                    <input
                      type="text"
                      value={countryOrRegion}
                      onChange={(e) => setCountryOrRegion(e.target.value)}
                      placeholder="e.g. United Kingdom, Canada, Global"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-slate-200 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0D192E] mb-1.5">
                      School, Organization, or Context (Optional)
                    </label>
                    <input
                      type="text"
                      value={institutionOrLocation}
                      onChange={(e) => setInstitutionOrLocation(e.target.value)}
                      placeholder="e.g. Riverdale High School (Grade 10 Physics)"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-slate-200 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#0D192E] mb-1.5">
                    What Happened? Detailed Description *
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Describe the context, what was said or written, which materials or policies were involved, and how gender roles or opportunities were treated unequally.
                  </p>
                  <textarea
                    rows={6}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific details about the curriculum excerpt, classroom directive, or organizational policy..."
                    className="w-full p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 leading-relaxed resize-y"
                  />
                </div>

                {/* Impact Observed */}
                <div>
                  <label className="block text-xs font-semibold text-[#0D192E] mb-1.5">
                    Impact or Outcome Observed (Optional)
                  </label>
                  <input
                    type="text"
                    value={impactObserved}
                    onChange={(e) => setImpactObserved(e.target.value)}
                    placeholder="e.g. Several students expressed discouragement from taking advanced STEM courses..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-slate-200 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>

                {/* Evidence Attachment */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#0D192E]">
                    Attach Photo, Screenshot, or Document Evidence (Optional)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf"
                    className="hidden"
                  />

                  {evidenceImage ? (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-[#2563EB] shrink-0" />
                        <span className="truncate font-medium">{evidenceName || 'Attached Evidence Image'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEvidenceImage(null);
                          setEvidenceName(null);
                        }}
                        className="text-blue-500 hover:text-blue-800 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 border-2 border-dashed border-slate-200 hover:border-[#2563EB] rounded-2xl text-xs text-slate-500 hover:text-black flex items-center justify-center gap-2 bg-[#FAF7F2]/50 hover:bg-white transition-all"
                    >
                      <Upload className="w-4 h-4 text-[#2563EB]" />
                      <span>Upload Textbook Scan, Assignment Photo, or Policy Screenshot</span>
                    </button>
                  )}
                </div>

                {/* Ledger Transparency Consent */}
                <div className="pt-2 border-t border-slate-100 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="ledgerConsent"
                    checked={isPublicInLedger}
                    onChange={(e) => setIsPublicInLedger(e.target.checked)}
                    className="mt-0.5 rounded accent-[#2563EB]"
                  />
                  <label htmlFor="ledgerConsent" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                    <strong>Display anonymously in the Community Case Ledger:</strong> Allow educational researchers and students worldwide to review this instance as an educational case study (identifying personal information is never published).
                  </label>
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Protected by EQUORA Ethical Research & Confidentiality Charter</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 text-xs font-semibold text-white bg-gradient-to-r from-[#0D192E] to-[#1E293B] hover:from-[#1E293B] hover:to-[#2563EB] disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Filing Report...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Incident Report</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMMUNITY INCIDENT LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {['All', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFeedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
                    feedCategory === cat
                      ? 'bg-[#0D192E] text-white shadow-2xs'
                      : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="w-full md:w-64">
              <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search documented reports..."
                  value={feedSearch}
                  onChange={(e) => setFeedSearch(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-xs"
                />
              </div>
            </div>
          </div>

          {/* Ledger Cards Grid */}
          {isLoadingReports ? (
            <div className="py-16 text-center text-xs text-slate-400">Loading documented community cases...</div>
          ) : filteredFeed.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeed.map((item) => (
                <article
                  key={item.id}
                  onClick={() => setSelectedFeedItem(item)}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-peach-300 transition-all flex flex-col justify-between group cursor-pointer space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-mono text-[#2563EB] font-semibold">{item.trackingCode}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold ${
                          item.status === 'Verified Case Study'
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.status === 'Action Documented'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#0D192E] leading-snug group-hover:text-[#2563EB] transition-colors line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>{item.countryOrRegion}</span>
                    </div>
                    <span className="text-slate-500 font-medium">{item.category}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No reports match your active category or search query.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TRACK BY CODE */}
      {activeTab === 'lookup' && (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#0D192E]">Track Your Incident Report</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your unique tracking identifier (e.g. EQ-REP-2024-8142) to check review progress, board verification notes, or suggested actions.
              </p>
            </div>

            <form onSubmit={handleSearchTracking} className="flex gap-2">
              <input
                type="text"
                required
                value={searchTrackingCode}
                onChange={(e) => setSearchTrackingCode(e.target.value)}
                placeholder="EQ-REP-2024-XXXX"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-slate-200 text-xs font-mono uppercase text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20"
              />
              <button
                type="submit"
                disabled={isSearchingTracking}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#0D192E] hover:bg-[#1E293B] rounded-2xl shadow-xs transition-colors"
              >
                {isSearchingTracking ? 'Searching...' : 'Lookup Status'}
              </button>
            </form>

            {trackingLookupError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
                {trackingLookupError}
              </div>
            )}

            {trackedReport && (
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-slate-200/90 space-y-4 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                  <span className="font-mono font-bold text-slate-900">{trackedReport.trackingCode}</span>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px]">
                    {trackedReport.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-mono text-slate-400">Title</div>
                  <div className="font-semibold text-slate-900 text-sm">{trackedReport.title}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-600">
                  <div>
                    <span className="text-slate-400">Category: </span>
                    <span className="font-medium text-slate-800">{trackedReport.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Date Filed: </span>
                    <span className="font-medium text-slate-800">{trackedReport.incidentDate}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-mono text-slate-400">Description</div>
                  <p className="text-slate-700 leading-relaxed">{trackedReport.description}</p>
                </div>

                {trackedReport.pedagogicalNotes && (
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
                    <div className="font-semibold text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Reviewer Pedagogical Assessment</span>
                    </div>
                    <p className="text-blue-800 leading-relaxed text-[11px]">{trackedReport.pedagogicalNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal for Selected Feed Item */}
      {selectedFeedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2563EB]">{selectedFeedItem.trackingCode}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-slate-700">{selectedFeedItem.category}</span>
              </div>
              <button
                onClick={() => setSelectedFeedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                {selectedFeedItem.status}
              </span>
              <h3 className="text-xl font-serif font-bold text-[#0D192E] leading-snug">
                {selectedFeedItem.title}
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <span className="text-slate-400">Region: </span>
                <span className="font-medium text-slate-800">{selectedFeedItem.countryOrRegion}</span>
              </div>
              <div>
                <span className="text-slate-400">Date: </span>
                <span className="font-medium text-slate-800">{selectedFeedItem.incidentDate}</span>
              </div>
              {selectedFeedItem.institutionOrLocation && (
                <div className="col-span-2">
                  <span className="text-slate-400">Location/Context: </span>
                  <span className="font-medium text-slate-800">{selectedFeedItem.institutionOrLocation}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-slate-900">Incident Documentation:</span>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{selectedFeedItem.description}</p>
            </div>

            {selectedFeedItem.impactObserved && (
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-slate-900">Observed Impact:</span>
                <p className="text-slate-600 leading-relaxed">{selectedFeedItem.impactObserved}</p>
              </div>
            )}

            {selectedFeedItem.pedagogicalNotes && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-[#2563EB]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Educational Review & Analysis</span>
                </span>
                <p className="text-blue-800 leading-relaxed text-[11px]">{selectedFeedItem.pedagogicalNotes}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedFeedItem(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#0D192E] hover:bg-[#1E293B] rounded-xl"
              >
                Close Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
