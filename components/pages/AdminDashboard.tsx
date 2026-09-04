'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, FolderKanban, CalendarDays, BarChart3, 
  Settings as SettingsIcon, LogOut, Search, Filter, Eye, 
  X, Save, FileText, CheckCircle, Clock, 
  Moon, Sun, AlertCircle, ShieldAlert, Check, Calendar, HelpCircle, Trash2, Download, RefreshCw, RotateCcw, ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend 
} from 'recharts';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Project, ProjectStatus, ProjectPriority, AnalyticsSummary } from '@/types';
import { ProjectRevision, RevisionStatus } from '@/types/revision';
import { 
  checkAuthStatus, loginAdmin, logoutAdmin, getProjects, getRevisions,
  updateProject, deleteProject, updateRevision, getSettings, updateSettings,
  getProjectFileUrl, getRevisionFileUrl, downloadServerLogs, SettingsResponse 
} from '@/lib/api';
import { useAppRouter } from '@/lib/navigation';
import BrandLogo from '@/components/BrandLogo';

type AdminTab = 'overview' | 'projects' | 'revisions' | 'calendar' | 'analytics' | 'settings';

export default function AdminDashboard() {
  const { goTo } = useAppRouter();
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // App settings state
  const [appSettings, setAppSettings] = useState<SettingsResponse | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Core Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [revisions, setRevisions] = useState<ProjectRevision[]>([]);
  const [dataSource, setDataSource] = useState<string>('local_database');
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Selected Revision (Drawer)
  const [selectedRevision, setSelectedRevision] = useState<ProjectRevision | null>(null);
  const [isRevisionDrawerOpen, setIsRevisionDrawerOpen] = useState(false);
  const [revisionDrawerStatus, setRevisionDrawerStatus] = useState<RevisionStatus>('Pending');
  const [revisionDrawerNotes, setRevisionDrawerNotes] = useState('');
  const [isSavingRevision, setIsSavingRevision] = useState(false);

  // Selected Project (Drawer Details)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState<ProjectStatus>('Todo');
  const [drawerPriority, setDrawerPriority] = useState<ProjectPriority>('Medium');
  const [drawerNotes, setDrawerNotes] = useState('');
  const [drawerComment, setDrawerComment] = useState('');
  const [isSavingDrawer, setIsSavingDrawer] = useState(false);
  const [isDeletingDrawer, setIsDeletingDrawer] = useState(false);

  // Filters state
  const [filterSearch, setFilterSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterService, setFilterService] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterSort, setFilterSort] = useState<'Newest' | 'Oldest'>('Newest');

  // Theme settings
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check auth session on load
  useEffect(() => {
    async function verifySession() {
      const status = await checkAuthStatus();
      setIsAuthenticated(status.authenticated);
      setAuthLoading(false);
      if (status.authenticated) {
        fetchInitialData();
      }
    }
    verifySession();

    // Check system preference dark mode initially
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const fetchInitialData = async () => {
    setIsLoadingData(true);
    const projRes = await getProjects();
    setProjects(projRes.data);
    setDataSource(projRes.source);

    const revRes = await getRevisions();
    setRevisions(revRes.data);

    const setRes = await getSettings();
    if (setRes) {
      setAppSettings(setRes);
    }
    setIsLoadingData(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const res = await loginAdmin(loginUsername, loginPassword);
    setIsLoggingIn(false);

    if (res.success) {
      setIsAuthenticated(true);
      fetchInitialData();
    } else {
      setLoginError(res.error || 'Access denied. Incorrect login combination.');
    }
  };

  const handleLogout = async () => {
    const success = await logoutAdmin();
    if (success) {
      setIsAuthenticated(false);
      goTo('home');
    }
  };

  const handleDownloadLogs = async () => {
    try {
      await downloadServerLogs();
    } catch {
      alert('Failed to download server logs.');
    }
  };

  const handleToggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const openProjectDetails = (proj: Project) => {
    setSelectedProject(proj);
    setDrawerStatus(proj.status);
    setDrawerPriority(proj.priority);
    setDrawerNotes(proj.notes || '');
    setDrawerComment('');
    setIsDrawerOpen(true);
  };

  const openRevisionDetails = (rev: ProjectRevision) => {
    setSelectedRevision(rev);
    setRevisionDrawerStatus(rev.status);
    setRevisionDrawerNotes(rev.adminNotes || '');
    setIsRevisionDrawerOpen(true);
  };

  const handleDownloadRevisionFile = async (revisionId: string) => {
    const fileInfo = await getRevisionFileUrl(revisionId);
    if (fileInfo?.url) {
      window.open(fileInfo.url, '_blank', 'noopener,noreferrer');
      return;
    }
    alert('No stored file available for this revision.');
  };

  const saveRevisionDetails = async () => {
    if (!selectedRevision) return;
    setIsSavingRevision(true);
    const res = await updateRevision(selectedRevision.id, {
      status: revisionDrawerStatus,
      adminNotes: revisionDrawerNotes,
    });
    setIsSavingRevision(false);
    if (res.success && res.data) {
      setRevisions((prev) => prev.map((r) => (r.id === selectedRevision.id ? res.data! : r)));
      setSelectedRevision(res.data);
      setIsRevisionDrawerOpen(false);
    } else {
      alert(res.error || 'Failed to update revision.');
    }
  };

  const getRevisionStatusStyle = (status: RevisionStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400';
      case 'Reviewing': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400';
      case 'In Progress': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400';
      case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400';
      case 'Closed': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const pendingRevisionsCount = revisions.filter((r) => r.status === 'Pending').length;

  const handleDownloadStoredFile = async (projectId: string) => {
    const fileInfo = await getProjectFileUrl(projectId);
    if (fileInfo?.url) {
      window.open(fileInfo.url, '_blank', 'noopener,noreferrer');
      return;
    }
    alert('No stored file available for download.');
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    const confirmed = window.confirm(
      `Permanently delete order ${selectedProject.id} (${selectedProject.clientName})? This is logged and cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeletingDrawer(true);
    const res = await deleteProject(selectedProject.id);
    setIsDeletingDrawer(false);

    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
      setIsDrawerOpen(false);
      setSelectedProject(null);
    } else {
      alert(res.error || 'Failed to delete project.');
    }
  };

  const saveProjectDetails = async () => {
    if (!selectedProject) return;
    setIsSavingDrawer(true);

    const res = await updateProject(selectedProject.id, {
      status: drawerStatus,
      priority: drawerPriority,
      notes: drawerNotes,
      comment: drawerComment.trim() || undefined
    });

    setIsSavingDrawer(false);

    if (res.success && res.data) {
      // Update locally
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? res.data! : p));
      setSelectedProject(res.data);
      setDrawerComment('');
      setIsDrawerOpen(false);
    } else {
      alert(res.error || 'Failed to update project data.');
    }
  };

  // Drag and drop Calendar trigger
  const handleCalendarEventDrop = async (info: any) => {
    const projectId = info.event.id;
    const nextDate = info.event.start.toISOString().split('T')[0];

    const confirmed = window.confirm(`Update project ${projectId} deadline target to ${nextDate}?`);
    if (!confirmed) {
      info.revert();
      return;
    }

    const res = await updateProject(projectId, {
      deadline: nextDate,
      comment: `Project deadline rescheduled to ${nextDate} via calendar coordinate drag.`
    });

    if (res.success) {
      setProjects(prev => prev.map(p => p.id === projectId ? res.data! : p));
    } else {
      alert('Fail: ' + res.error);
      info.revert();
    }
  };

  // Calendar Event click
  const handleCalendarEventClick = (info: any) => {
    const proj = projects.find(p => p.id === info.event.id);
    if (proj) {
      openProjectDetails(proj);
    }
  };

  // Settings Save
  const handleSaveSettings = async (updatedFields: Partial<SettingsResponse>) => {
    if (!appSettings) return;
    const res = await updateSettings(updatedFields);
    if (res.success) {
      setAppSettings(prev => prev ? { ...prev, ...updatedFields } : null);
      alert('Business configurations updated!');
    } else {
      alert('Update failed: ' + res.error);
    }
  };

  // Analytics helper variables
  const getAnalytics = (): AnalyticsSummary => {
    const pending = projects.filter(p => ['Todo', 'Review', 'In Progress', 'Waiting Client'].includes(p.status)).length;
    const completed = projects.filter(p => p.status === 'Completed' || p.status === 'Delivered').length;
    const cancelled = projects.filter(p => p.status === 'Cancelled').length;
    const inProgress = projects.filter(p => p.status === 'In Progress').length;
    
    const revenuePlaceholder = projects
      .filter(p => p.status !== 'Cancelled')
      .reduce((sum, p) => {
        const amt = parseFloat((p.budget || '').replace(/[^0-9.]/g, '')) || 0;
        return sum + amt;
      }, 0);

    // Compute distribution lists
    const serviceDistributionMap: Record<string, number> = {};
    const statusDistributionMap: Record<string, number> = {};

    projects.forEach(p => {
      serviceDistributionMap[p.serviceRequired] = (serviceDistributionMap[p.serviceRequired] || 0) + 1;
      statusDistributionMap[p.status] = (statusDistributionMap[p.status] || 0) + 1;
    });

    const serviceDistribution = Object.entries(serviceDistributionMap).map(([name, value]) => ({ name, value }));
    const statusDistribution = Object.entries(statusDistributionMap).map(([name, value]) => ({ name, value }));

    // Mock projects per month representing current load
    const projectsPerMonth = [
      { month: 'Jan', count: 4 },
      { month: 'Feb', count: 8 },
      { month: 'Mar', count: 12 },
      { month: 'Apr', count: 10 },
      { month: 'May', count: 15 },
      { month: 'Jun', count: projects.length }
    ];

    const completionRate = projects.length > 0 
      ? Math.round((completed / projects.length) * 100) 
      : 0;

    // Collate audit logs
    const recentActivities: any[] = [];
    projects.forEach(p => {
      p.timeline.forEach((t, tIdx) => {
        recentActivities.push({
          id: `${p.id}-t-${tIdx}`,
          projectId: p.id,
          clientName: p.clientName,
          type: t.status === 'Todo' ? 'new_submission' : 'status_change',
          description: t.comment || `Status updated to ${t.status}`,
          timestamp: t.updatedAt
        });
      });
    });

    // Sort logs newest first
    recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      totalProjects: projects.length,
      pending,
      inProgress,
      completed,
      cancelled,
      revenuePlaceholder,
      projectsPerMonth,
      serviceDistribution,
      statusDistribution,
      completionRate,
      recentActivities: recentActivities.slice(0, 10)
    };
  };

  const metrics = getAnalytics();

  // Status visual configurations
  const getStatusStyle = (status: ProjectStatus) => {
    switch (status) {
      case 'Todo':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200';
      case 'Review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200';
      case 'Waiting Client':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400 border-red-200';
    }
  };

  const getPriorityStyle = (priority: ProjectPriority) => {
    switch (priority) {
      case 'Low':
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900 border-gray-100';
      case 'Medium':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-100';
      case 'High':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-100';
      case 'Urgent':
        return 'text-red-600 bg-red-50 dark:bg-red-950/30 border-red-100 font-bold';
    }
  };

  // Recharts colors
  const PIE_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#3B82F6'];

  // Filtering projects list
  const filteredProjects = projects.filter(proj => {
    const matchesSearch = 
      proj.clientName.toLowerCase().includes(filterSearch.toLowerCase()) ||
      (proj.companyName || '').toLowerCase().includes(filterSearch.toLowerCase()) ||
      proj.id.toLowerCase().includes(filterSearch.toLowerCase()) ||
      proj.serviceRequired.toLowerCase().includes(filterSearch.toLowerCase());

    const matchesStatus = filterStatus === 'All' || proj.status === filterStatus;
    const matchesService = filterService === 'All' || proj.serviceRequired === filterService;
    const matchesPriority = filterPriority === 'All' || proj.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesService && matchesPriority;
  }).sort((a, b) => {
    const timeA = new Date(a.submissionDate).getTime();
    const timeB = new Date(b.submissionDate).getTime();
    return filterSort === 'Newest' ? timeB - timeA : timeA - timeB;
  });

  // Calendar event array mapper
  const getCalendarEvents = () => {
    return projects.map(p => {
      let color = '#2563EB'; // default blue
      if (p.status === 'Completed' || p.status === 'Delivered') color = '#10B981';
      if (p.status === 'Cancelled') color = '#EF4444';
      if (p.status === 'Review') color = '#F59E0B';
      if (p.status === 'Waiting Client') color = '#8B5CF6';

      return {
        id: p.id,
        title: `${p.id} - ${p.clientName}`,
        start: p.deadline,
        backgroundColor: color,
        borderColor: color,
        extendedProps: { ...p }
      };
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-blue" />
          <span className="text-sm font-mono font-medium">VERIFYING ADMINISTRATIVE TOKEN...</span>
        </div>
      </div>
    );
  }

  // Login Screen Gating
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Ambient grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 [mask-image:radial-gradient(circle_at_center,black_60%,transparent_100%)]" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-2xl p-8 relative z-10 text-left"
        >
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <BrandLogo height={56} clickable={false} />
            <div>
              <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
                Admin Portal
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Authorized team members only
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" id="login-form">
            {loginError && (
              <div className="p-3.5 rounded-lg border border-red-100 bg-red-50 text-red-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                ADMIN_USERNAME (From System Env)
              </label>
              <input
                type="text"
                placeholder="Enter username"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 focus:border-brand-blue focus:ring-brand-blue text-sm bg-white dark:bg-gray-950"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                ADMIN_PASSWORD
              </label>
              <input
                type="password"
                placeholder="Enter passcode"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 focus:border-brand-blue focus:ring-brand-blue text-sm bg-white dark:bg-gray-950"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              id="login-submit-btn"
              className="w-full py-4.5 rounded-lg bg-black hover:bg-brand-blue text-white font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In with JWT Secure'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <button
              onClick={() => goTo('home')}
              className="text-xs text-gray-500 hover:text-brand-blue font-medium transition-colors cursor-pointer"
            >
              ← Back to Agency Website
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pt-20 flex">
      
      {/* Sidebar Navigation */}
      <aside 
        id="admin-sidebar"
        className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 hidden md:flex flex-col justify-between p-6 sticky top-20 h-[calc(100vh-80px)]"
      >
        <div className="space-y-8">
          {/* Active credential status badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-805">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono text-gray-500 font-bold leading-none">ROOT OPERATOR</span>
              <span className="text-[9px] text-gray-400 mt-0.5 font-mono leading-none">SESSION SECURE</span>
            </div>
          </div>

          <nav className="space-y-1.5 flex flex-col text-left">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === 'overview'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-850'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === 'projects'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-850'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Project Submissions</span>
              <span className="ml-auto text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono font-bold shrink-0">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('revisions')}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === 'revisions'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-850'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Revision Requests</span>
              {pendingRevisionsCount > 0 && (
                <span className="ml-auto text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono font-bold shrink-0">
                  {pendingRevisionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === 'calendar'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-850'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Deadlines Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-850'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics Charts</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === 'settings'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-850'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>System Settings</span>
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleToggleTheme}
            className="w-full px-4 py-3 rounded-lg text-xs font-mono font-bold flex items-center justify-between border border-gray-150 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-brand-blue" />}
              <span>{isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}</span>
            </span>
            <div className="w-6 h-4 bg-gray-300 dark:bg-brand-blue rounded-full p-0.5 flex items-center justify-end dark:justify-start">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main id="dashboard-content" className="flex-1 p-6 sm:p-8 lg:p-10 overflow-x-hidden text-left bg-gray-50 dark:bg-gray-950">
        
        {/* Quick mobile navigation headers */}
        <div className="md:hidden flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
            <BrandLogo height={32} clickable={false} />
            <span className="font-display font-bold text-sm text-gray-900 dark:text-white">Portal</span>
          </div>
          
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as AdminTab)}
            className="text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded cursor-pointer font-medium"
          >
            <option value="overview">Overview</option>
            <option value="projects">Projects List</option>
            <option value="revisions">Revisions</option>
            <option value="calendar">Calendar</option>
            <option value="analytics">Analytics</option>
            <option value="settings">Settings</option>
          </select>
        </div>

        {/* Data source & logs banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-150 dark:border-gray-800 shadow-sm mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-brand-blue flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-gray-900 dark:text-white">
                Active Source: <span className="font-mono text-brand-blue uppercase">{dataSource.replace('_', ' ')}</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {appSettings?.supabaseConnected
                  ? 'Primary database: Supabase (Postgres + Storage). All actions are logged.'
                  : 'Using local JSON fallback. Configure Supabase for production persistence.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadLogs}
            className="px-4 py-2 rounded bg-black hover:bg-brand-blue text-white text-xs font-semibold font-mono flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD SERVER LOGS
          </button>
        </div>

        {/* TAB CONTENTS */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-8"
            >
              {/* Stat blocks */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Projects', value: metrics.totalProjects, desc: 'Across entire database' },
                  { title: 'In Production Queue', value: metrics.inProgress, desc: 'Active designers working' },
                  { title: 'Pending Revisions', value: pendingRevisionsCount, desc: 'Client revision requests awaiting review' },
                  { title: 'Completed Sales', value: `$${metrics.revenuePlaceholder.toLocaleString()}`, desc: 'Total budget sum' }
                ].map((card, idx) => (
                  <div key={idx} className="p-6 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl shadow-sm text-left">
                    <span className="text-xs font-mono uppercase text-gray-400 font-bold leading-none">{card.title}</span>
                    <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mt-2 leading-none">
                      {card.value}
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">{card.desc}</p>
                  </div>
                ))}
              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left block: Urgent list */}
                <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 p-6 flex flex-col justify-between">
                  <div className="space-y-2 mb-6">
                    <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                      Action Items Needed
                    </h3>
                    <p className="text-xs text-gray-500">
                      High or Urgent priority projects that remain uncompleted.
                    </p>
                  </div>

                  <div className="space-y-3 flex-1">
                    {projects.filter(p => ['High', 'Urgent'].includes(p.priority) && p.status !== 'Completed' && p.status !== 'Delivered').length === 0 ? (
                      <div className="py-12 text-center text-xs text-gray-400">
                        Zero high priority action items remaining! Beautifully clear.
                      </div>
                    ) : (
                      projects
                        .filter(p => ['High', 'Urgent'].includes(p.priority) && p.status !== 'Completed' && p.status !== 'Delivered')
                        .slice(0, 5)
                        .map(p => (
                          <div 
                            key={p.id}
                            onClick={() => openProjectDetails(p)}
                            className="p-4 rounded-lg border border-gray-100 dark:border-gray-805 bg-gray-50/50 dark:bg-gray-950/30 hover:border-brand-blue cursor-pointer flex items-center justify-between text-xs"
                          >
                            <div className="space-y-1 text-left">
                              <span className="font-mono font-bold text-brand-blue block">{p.id} - {p.clientName}</span>
                              <span className="text-gray-500 block leading-none">{p.serviceRequired} • Deadline: {p.deadline}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${getPriorityStyle(p.priority)}`}>
                              {p.priority}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Right block: Audit activity feed */}
                <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 p-6">
                  <div className="space-y-2 mb-6">
                    <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                      Recent Activity Feed
                    </h3>
                    <p className="text-xs text-gray-500">
                      Real-time queue timeline modifications audit log.
                    </p>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {metrics.recentActivities.length === 0 ? (
                      <div className="py-12 text-center text-xs text-gray-400">
                        No recent updates logged.
                      </div>
                    ) : (
                      metrics.recentActivities.map(log => (
                        <div key={log.id} className="flex gap-3 text-xs">
                          <div className="w-2 h-2 rounded-full bg-brand-blue mt-1 shrink-0" />
                          <div className="space-y-1 text-left">
                            <span className="text-gray-900 dark:text-white font-medium block leading-tight">
                              {log.clientName} ({log.projectId})
                            </span>
                            <span className="text-gray-500 block leading-tight">
                              {log.description}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400 block">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PROJECTS TABLE */}
          {activeTab === 'projects' && (
            <motion.div
              key="tab-projects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              {/* Filter Row card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* Search box */}
                  <div className="md:col-span-4 relative">
                    <Search className="w-4 h-4 text-gray-400 absolute top-3.5 left-4" />
                    <input
                      type="text"
                      placeholder="Search Client, ID, Company..."
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>

                  {/* Status select */}
                  <div className="md:col-span-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs font-semibold cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Todo">Todo</option>
                      <option value="Review">Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting Client">Waiting Client</option>
                      <option value="Completed">Completed</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Service select */}
                  <div className="md:col-span-2">
                    <select
                      value={filterService}
                      onChange={(e) => setFilterService(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs font-semibold cursor-pointer"
                    >
                      <option value="All">All Services</option>
                      <option value="Vector Art Conversion">Vector Art Conversion</option>
                      <option value="Clipping Path">Clipping Path</option>
                      <option value="Background Removal">Background Removal</option>
                      <option value="Image Masking">Image Masking</option>
                      <option value="Photo Retouching">Photo Retouching</option>
                      <option value="Shadow Creation">Shadow Creation</option>
                      <option value="Ghost Mannequin">Ghost Mannequin</option>
                      <option value="Color Change">Color Change</option>
                      <option value="Graphic Designing">Graphic Designing</option>
                      <option value="Professional Embroidery Digitizing">Professional Embroidery Digitizing</option>
                      <option value="Staffing Support">Staffing Support</option>
                      <option value="Virtual Assistants">Virtual Assistants</option>
                      <option value="Admin Support">Admin Support</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div className="md:col-span-2">
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs font-semibold cursor-pointer"
                    >
                      <option value="All">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  {/* Sort order */}
                  <div className="md:col-span-2">
                    <select
                      value={filterSort}
                      onChange={(e) => setFilterSort(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs font-semibold cursor-pointer"
                    >
                      <option value="Newest">Newest First</option>
                      <option value="Oldest">Oldest First</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Main table component */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 shadow-sm overflow-x-auto">
                {isLoadingData ? (
                  <div className="py-24 text-center text-xs text-gray-500 font-mono">
                    REFRESHING CORE REGISTRIES...
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="py-24 text-center text-xs text-gray-400">
                    No matching project records found. Try adjusting your search queries or filter selectors.
                  </div>
                ) : (
                  <table className="w-full min-w-[1000px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20 font-mono font-bold text-gray-400 uppercase">
                        <th className="p-4.5">Project ID</th>
                        <th className="p-4.5">Client & Company</th>
                        <th className="p-4.5">Required Service</th>
                        <th className="p-4.5">Submission Date</th>
                        <th className="p-4.5">Deadline</th>
                        <th className="p-4.5">Priority</th>
                        <th className="p-4.5">Status</th>
                        <th className="p-4.5 text-center">Files</th>
                        <th className="p-4.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-805">
                      {filteredProjects.map(p => (
                        <tr 
                          key={p.id}
                          className="hover:bg-gray-50/40 dark:hover:bg-gray-950/20 transition-colors"
                        >
                          {/* ID */}
                          <td className="p-4.5 font-mono font-bold text-brand-blue">{p.id}</td>
                          
                          {/* Client */}
                          <td className="p-4.5 text-left">
                            <span className="font-semibold text-gray-900 dark:text-white block">{p.clientName}</span>
                            <span className="text-gray-400 text-[10px] block mt-0.5">{p.companyName || 'No Company'}</span>
                          </td>

                          {/* Service */}
                          <td className="p-4.5 font-medium">{p.serviceRequired}</td>

                          {/* Date */}
                          <td className="p-4.5 text-gray-400 font-mono">
                            {new Date(p.submissionDate).toLocaleDateString()}
                          </td>

                          {/* Deadline */}
                          <td className="p-4.5 font-mono font-medium">{p.deadline}</td>

                          {/* Priority */}
                          <td className="p-4.5">
                            <span className={`px-2.5 py-1.5 rounded-md text-[10px] border font-mono font-bold ${getPriorityStyle(p.priority)}`}>
                              {p.priority}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-4.5">
                            <span className={`px-2.5 py-1.5 rounded-md text-[10px] font-semibold border ${getStatusStyle(p.status)}`}>
                              {p.status}
                            </span>
                          </td>

                          {/* File Indicator */}
                          <td className="p-4.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {p.uploadedFile && (
                                <span className="p-1 rounded bg-gray-100 dark:bg-gray-800" title={`Direct Upload: ${p.uploadedFile}`}>
                                  <FileText className="w-3.5 h-3.5 text-gray-500" />
                                </span>
                              )}
                              {p.googleDriveLink && (
                                <a 
                                  href={p.googleDriveLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-1 rounded bg-blue-50 dark:bg-blue-950/40 text-brand-blue" 
                                  title="Shared Google Drive Link"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Action Button */}
                          <td className="p-4.5 text-center">
                            <button
                              onClick={() => openProjectDetails(p)}
                              className="px-3 py-1.5 rounded bg-gray-100 hover:bg-black dark:bg-gray-800 dark:hover:bg-white hover:text-white dark:hover:text-black font-semibold text-[10px] uppercase font-mono cursor-pointer transition-all"
                            >
                              Edit/QC
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: REVISIONS */}
          {activeTab === 'revisions' && (
            <motion.div
              key="tab-revisions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">Revision Requests</h2>
                  <p className="text-xs text-gray-500 mt-1">Client-submitted revision orders linked by ticket ID or email.</p>
                </div>
                <button
                  onClick={fetchInitialData}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-xs font-mono flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </button>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 overflow-hidden shadow-sm">
                {revisions.length === 0 ? (
                  <div className="py-16 text-center text-sm text-gray-400">No revision requests yet.</div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
                      <tr>
                        <th className="p-4 font-mono font-bold uppercase text-[10px] text-gray-500">ID</th>
                        <th className="p-4 font-mono font-bold uppercase text-[10px] text-gray-500">Ticket / Project</th>
                        <th className="p-4 font-mono font-bold uppercase text-[10px] text-gray-500">Email</th>
                        <th className="p-4 font-mono font-bold uppercase text-[10px] text-gray-500">Submitted</th>
                        <th className="p-4 font-mono font-bold uppercase text-[10px] text-gray-500">Status</th>
                        <th className="p-4 font-mono font-bold uppercase text-[10px] text-gray-500 text-center">Files</th>
                        <th className="p-4 font-mono font-bold uppercase text-[10px] text-gray-500 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {revisions.map((rev) => (
                        <tr key={rev.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-950/30">
                          <td className="p-4 font-mono font-bold text-brand-blue">{rev.id}</td>
                          <td className="p-4">
                            {rev.projectId ? (
                              <button
                                onClick={() => {
                                  const proj = projects.find((p) => p.id === rev.projectId);
                                  if (proj) openProjectDetails(proj);
                                }}
                                className="text-brand-blue hover:underline cursor-pointer font-mono"
                              >
                                {rev.projectId}
                              </button>
                            ) : (
                              <span className="text-gray-400 font-mono">{rev.ticketId || 'Unlinked'}</span>
                            )}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-400">{rev.email}</td>
                          <td className="p-4 font-mono text-gray-500">{new Date(rev.submissionDate).toLocaleDateString()}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${getRevisionStatusStyle(rev.status)}`}>
                              {rev.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {rev.uploadedFile && <FileText className="w-4 h-4 text-brand-blue inline" />}
                            {rev.googleDriveLink && <ExternalLink className="w-4 h-4 text-brand-secondary inline ml-1" />}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => openRevisionDetails(rev)}
                              className="px-3 py-1.5 rounded bg-gray-100 hover:bg-black dark:bg-gray-800 dark:hover:bg-white hover:text-white dark:hover:text-black font-semibold text-[10px] uppercase font-mono cursor-pointer"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: CALENDAR VIEW */}
          {activeTab === 'calendar' && (
            <motion.div
              key="tab-calendar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 p-6 shadow-sm"
            >
              <div className="mb-6 space-y-2">
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                  Client Deadline Coordinates
                </h3>
                <p className="text-xs text-gray-500">
                  Drag and drop events to reschedule deadlines directly inside the calendar grid. Updates are saved to Supabase and logged.
                </p>
              </div>

              <div id="calendar-view-panel" className="text-gray-900 dark:text-white">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  events={getCalendarEvents()}
                  eventClick={handleCalendarEventClick}
                  eventDrop={handleCalendarEventDrop}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* TAB 4: ANALYTICS CHARTS */}
          {activeTab === 'analytics' && (
            <motion.div
              key="tab-analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-8"
            >
              {/* Analytics stat overview */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { title: 'Total Projects', value: metrics.totalProjects, color: 'text-gray-900 dark:text-white' },
                  { title: 'Pending Work', value: metrics.pending, color: 'text-amber-500' },
                  { title: 'Active Production', value: metrics.inProgress, color: 'text-blue-500' },
                  { title: 'Completed Tasks', value: metrics.completed, color: 'text-emerald-500' },
                  { title: 'Completion Rate', value: `${metrics.completionRate}%`, color: 'text-brand-blue' }
                ].map((stat, i) => (
                  <div key={i} className="p-5 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl shadow-sm text-left">
                    <span className="text-[10px] font-mono uppercase text-gray-400 font-bold leading-none">{stat.title}</span>
                    <div className={`text-2xl font-display font-bold mt-2 leading-none ${stat.color}`}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recharts Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Monthly Volume Load */}
                <div className="lg:col-span-8 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                  <h4 className="font-display font-bold text-base text-gray-900 dark:text-white mb-6">
                    Weekly Projects Load
                  </h4>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metrics.projectsPerMonth}>
                        <defs>
                          <linearGradient id="chartBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="count" name="Submissions" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#chartBlue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status distribution Pie */}
                <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                  <h4 className="font-display font-bold text-base text-gray-900 dark:text-white mb-6">
                    Status Distribution
                  </h4>
                  <div className="h-56 relative flex items-center justify-center">
                    {metrics.statusDistribution.length === 0 ? (
                      <span className="text-xs text-gray-400 font-mono">NO RECORDS YET</span>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={metrics.statusDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {metrics.statusDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  {/* Legends */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[10px]">
                    {metrics.statusDistribution.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 font-mono">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                        <span className="text-gray-500 uppercase">{entry.name}: {entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service type popularity bar */}
                <div className="lg:col-span-12 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                  <h4 className="font-display font-bold text-base text-gray-900 dark:text-white mb-6">
                    Popular Services Distribution
                  </h4>
                  <div className="h-72">
                    {metrics.serviceDistribution.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-gray-400 font-mono">NO DATA</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics.serviceDistribution}>
                          <XAxis dataKey="name" stroke="#9ca3af" fontSize={9} tickLine={false} />
                          <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                          <Tooltip />
                          <Bar dataKey="value" name="Submissions count" fill="#2563EB" radius={[4, 4, 0, 0]}>
                            {metrics.serviceDistribution.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={idx % 2 === 0 ? '#2563EB' : '#1D4ED8'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div
              key="tab-settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
            >
              
              {/* Supabase status */}
              <div className="lg:col-span-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-gray-900 dark:text-white">
                      Supabase Database & Storage
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Production persistence for client projects and uploaded files. Configure via environment variables on your host.
                    </p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase px-3 py-1.5 rounded-full ${
                    appSettings?.supabaseConnected
                      ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                  }`}>
                    {appSettings?.supabaseConnected ? 'Connected' : 'Not Configured'}
                  </span>
                </div>
                {!appSettings?.supabaseConnected && (
                  <ul className="mt-4 list-disc list-inside space-y-1 font-mono text-[10px] text-brand-blue">
                    <li>SUPABASE_URL</li>
                    <li>SUPABASE_SERVICE_ROLE_KEY</li>
                  </ul>
                )}
              </div>

              {/* Server logs panel */}
              <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-display font-bold text-base text-gray-900 dark:text-white">
                    Server Activity Logs
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1">
                    All project submissions, updates, deletions, auth events, and API requests are logged to the server. Download the log file for audit and compliance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadLogs}
                  className="px-4 py-2.5 rounded bg-black hover:bg-brand-blue text-white text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download server logs
                </button>
              </div>

              {/* Corporate Info panel */}
              <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 p-6 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-base text-gray-900 dark:text-white">
                  Corporate Agency Information
                </h3>

                <form 
                  id="business-settings-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    handleSaveSettings({
                      businessName: fd.get('businessName') as string,
                      businessEmail: fd.get('businessEmail') as string,
                      businessPhone: fd.get('businessPhone') as string,
                      businessAddress: fd.get('businessAddress') as string,
                      businessHours: fd.get('businessHours') as string,
                      socialLinks: {
                        instagram: (fd.get('instagram') as string) || '',
                        facebook: (fd.get('facebook') as string) || '',
                        linkedin: (fd.get('linkedin') as string) || '',
                        twitter: (fd.get('twitter') as string) || '',
                        youtube: (fd.get('youtube') as string) || '',
                        tiktok: (fd.get('tiktok') as string) || '',
                      },
                    });
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <label className="font-bold font-mono uppercase text-gray-500 text-[10px]">Business Name</label>
                    <input type="text" name="businessName" defaultValue={appSettings?.businessName || ''} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold font-mono uppercase text-gray-500 text-[10px]">Business Email</label>
                    <input type="email" name="businessEmail" defaultValue={appSettings?.businessEmail || ''} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold font-mono uppercase text-gray-500 text-[10px]">Phone Number</label>
                    <input type="text" name="businessPhone" defaultValue={appSettings?.businessPhone || ''} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold font-mono uppercase text-gray-500 text-[10px]">Office Address</label>
                    <input type="text" name="businessAddress" defaultValue={appSettings?.businessAddress || ''} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold font-mono uppercase text-gray-500 text-[10px]">Operating Hours</label>
                    <input type="text" name="businessHours" defaultValue={appSettings?.businessHours || ''} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                    <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white">Social Media Links</h4>
                    <p className="text-[10px] text-gray-500">URLs appear as icons in the site footer. Leave blank to hide.</p>
                    {(['instagram', 'facebook', 'linkedin', 'twitter', 'youtube', 'tiktok'] as const).map((platform) => (
                      <div key={platform} className="space-y-1">
                        <label className="font-bold font-mono uppercase text-gray-500 text-[10px]">{platform}</label>
                        <input
                          type="url"
                          name={platform}
                          defaultValue={appSettings?.socialLinks?.[platform] || ''}
                          placeholder={`https://${platform}.com/...`}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-black hover:bg-brand-blue text-white font-semibold text-xs cursor-pointer transition-colors"
                  >
                    Save Business Information
                  </button>
                </form>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* PROJECT DETAILS SLIDE DRAWER (COMPLEMENTARY ACCORDING TO REQUIREMENTS) */}
      <AnimatePresence>
        {isDrawerOpen && selectedProject && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />

            {/* Slide out Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-gray-900 z-50 shadow-2xl flex flex-col justify-between overflow-hidden text-left border-l border-gray-200 dark:border-gray-800"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-150 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <span className="font-mono text-brand-blue text-xs font-bold block">{selectedProject.id}</span>
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mt-0.5">
                    Project Audit Workspace
                  </h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable contents */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 text-xs">
                
                {/* Client particulars card */}
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-400">Client Particulars</h4>
                  <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-805 bg-gray-50/50 dark:bg-gray-950/20 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 font-mono block text-[10px]">CLIENT NAME</span>
                      <strong className="text-gray-900 dark:text-white text-xs mt-0.5 block">{selectedProject.clientName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 font-mono block text-[10px]">COMPANY</span>
                      <strong className="text-gray-900 dark:text-white text-xs mt-0.5 block">{selectedProject.companyName || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 font-mono block text-[10px]">EMAIL ADDRESS</span>
                      <strong className="text-gray-900 dark:text-white text-xs mt-0.5 block truncate" title={selectedProject.email}>
                        {selectedProject.email}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-400 font-mono block text-[10px]">PHONE</span>
                      <strong className="text-gray-900 dark:text-white text-xs mt-0.5 block">{selectedProject.phone || 'N/A'}</strong>
                    </div>
                  </div>
                </div>

                {/* Service & descriptions */}
                <div className="space-y-4 text-left">
                  <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-400">Submission Requirements</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 font-mono block text-[10px]">REQUIRED SERVICES</span>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{selectedProject.serviceRequired}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-mono block text-[10px]">PROJECT DESCRIPTION</span>
                      <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-100 dark:border-gray-805 leading-relaxed mt-1 whitespace-pre-wrap">
                        {selectedProject.projectDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Deliverable files links */}
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-400">Deliverables Files</h4>
                  <div className="space-y-2">
                    {selectedProject.uploadedFile && (
                      <div className="flex items-center justify-between p-3.5 rounded-lg border border-gray-100 dark:border-gray-805 bg-gray-50/50 dark:bg-gray-950/20 gap-3">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 truncate max-w-xs">{selectedProject.uploadedFile}</span>
                        {selectedProject.storagePath ? (
                          <button
                            type="button"
                            onClick={() => handleDownloadStoredFile(selectedProject.id)}
                            className="text-[10px] font-mono px-2 py-0.5 bg-brand-blue text-white rounded font-bold uppercase cursor-pointer hover:opacity-90"
                          >
                            Download
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-200 dark:bg-gray-800 rounded font-bold text-gray-500 uppercase">DIRECT FILE</span>
                        )}
                      </div>
                    )}
                    {selectedProject.googleDriveLink ? (
                      <a 
                        href={selectedProject.googleDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3.5 rounded-lg border border-blue-100 dark:border-blue-900/30 bg-blue-50/10 hover:bg-blue-50/20 text-brand-blue"
                      >
                        <span className="font-semibold truncate max-w-xs">{selectedProject.googleDriveLink}</span>
                        <span className="text-[10px] font-mono flex items-center gap-1 font-bold">G-DRIVE <Check className="w-3.5 h-3.5" /></span>
                      </a>
                    ) : (
                      <div className="py-4 text-center text-gray-400 italic">No Google Drive link provided.</div>
                    )}
                  </div>
                </div>

                {/* Queue status modification */}
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-400">Status & Priority Management</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono font-bold text-gray-500">PRODUCTION STATUS</label>
                      <select
                        value={drawerStatus}
                        onChange={(e) => setDrawerStatus(e.target.value as ProjectStatus)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 cursor-pointer font-semibold text-xs"
                      >
                        <option value="Todo">Todo</option>
                        <option value="Review">Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Waiting Client">Waiting Client</option>
                        <option value="Completed">Completed</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono font-bold text-gray-500">QUEUE PRIORITY</label>
                      <select
                        value={drawerPriority}
                        onChange={(e) => setDrawerPriority(e.target.value as ProjectPriority)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 cursor-pointer font-semibold text-xs"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Operator comments and annotations */}
                <div className="space-y-4 text-left">
                  <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-400">Operator Remarks</h4>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-gray-500">INTERNAL NOTES (PERMANENT STORAGE)</label>
                      <textarea
                        rows={2}
                        value={drawerNotes}
                        onChange={(e) => setDrawerNotes(e.target.value)}
                        placeholder="Add internal production details, assignees, or private notes..."
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-gray-500">TIMELINE LOG COMMENT (OPTIONAL)</label>
                      <input
                        type="text"
                        value={drawerComment}
                        onChange={(e) => setDrawerComment(e.target.value)}
                        placeholder="e.g. Completed hand-drawn vector tracing curves."
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Audit Timeline */}
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-400">Auditable Activity Logs</h4>
                  <div className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1">
                    {selectedProject.timeline.map((step, idx) => (
                      <div key={idx} className="flex gap-3 text-[11px] text-left">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0 mt-1.5" />
                        <div className="space-y-1">
                          <p className="text-gray-900 dark:text-white leading-none">
                            Status: <strong className="font-mono text-brand-blue">{step.status}</strong> • By: {step.updatedBy}
                          </p>
                          {step.comment && <p className="text-gray-500 italic">"{step.comment}"</p>}
                          <p className="text-[9px] text-gray-400 font-mono">
                            {new Date(step.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="p-6 border-t border-gray-150 dark:border-gray-800 flex flex-col gap-3 bg-gray-50 dark:bg-gray-950/20">
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1 py-3 border border-gray-205 dark:border-gray-800 rounded-lg text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-850 cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProjectDetails}
                    disabled={isSavingDrawer || isDeletingDrawer}
                    className="flex-1 py-3 bg-black hover:bg-brand-blue text-white rounded-lg text-xs font-semibold cursor-pointer text-center flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSavingDrawer ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save parameters</span>
                      </>
                    )}
                  </button>
                </div>
                <button
                  onClick={handleDeleteProject}
                  disabled={isSavingDrawer || isDeletingDrawer}
                  className="w-full py-3 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeletingDrawer ? (
                    <span>Deleting...</span>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete order permanently</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* REVISION DETAILS DRAWER */}
      <AnimatePresence>
        {isRevisionDrawerOpen && selectedRevision && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setIsRevisionDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto p-8 text-left"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="font-mono text-[10px] text-brand-accent font-bold uppercase">Revision Request</span>
                  <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">{selectedRevision.id}</h2>
                </div>
                <button onClick={() => setIsRevisionDrawerOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 text-sm">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 space-y-2">
                  <p><span className="font-mono text-[10px] text-gray-500 uppercase">Email</span><br />{selectedRevision.email}</p>
                  {selectedRevision.clientName && <p><span className="font-mono text-[10px] text-gray-500 uppercase">Name</span><br />{selectedRevision.clientName}</p>}
                  {selectedRevision.ticketId && <p><span className="font-mono text-[10px] text-gray-500 uppercase">Ticket ID</span><br />{selectedRevision.ticketId}</p>}
                  {selectedRevision.projectId && (
                    <p>
                      <span className="font-mono text-[10px] text-gray-500 uppercase">Linked Project</span><br />
                      <button
                        onClick={() => {
                          const proj = projects.find((p) => p.id === selectedRevision.projectId);
                          if (proj) { setIsRevisionDrawerOpen(false); openProjectDetails(proj); }
                        }}
                        className="text-brand-blue hover:underline cursor-pointer font-mono"
                      >
                        {selectedRevision.projectId}
                      </button>
                    </p>
                  )}
                </div>

                <div>
                  <span className="font-mono text-[10px] text-gray-500 uppercase font-bold">Revision Comments</span>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">{selectedRevision.revisionComments}</p>
                </div>

                {selectedRevision.additionalDetails && (
                  <div>
                    <span className="font-mono text-[10px] text-gray-500 uppercase font-bold">Additional Details</span>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{selectedRevision.additionalDetails}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  {selectedRevision.uploadedFile && (
                    <button
                      onClick={() => handleDownloadRevisionFile(selectedRevision.id)}
                      className="px-4 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold cursor-pointer flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download File
                    </button>
                  )}
                  {selectedRevision.googleDriveLink && (
                    <a
                      href={selectedRevision.googleDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Drive Link
                    </a>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <label className="font-mono text-[10px] text-gray-500 uppercase font-bold">Status</label>
                  <select
                    value={revisionDrawerStatus}
                    onChange={(e) => setRevisionDrawerStatus(e.target.value as RevisionStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm"
                  >
                    {(['Pending', 'Reviewing', 'In Progress', 'Resolved', 'Closed'] as RevisionStatus[]).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <label className="font-mono text-[10px] text-gray-500 uppercase font-bold">Admin Notes</label>
                  <textarea
                    value={revisionDrawerNotes}
                    onChange={(e) => setRevisionDrawerNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm resize-none"
                    placeholder="Internal notes about this revision..."
                  />

                  <button
                    onClick={saveRevisionDetails}
                    disabled={isSavingRevision}
                    className="w-full py-3 rounded-lg bg-black hover:bg-brand-blue text-white font-semibold text-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSavingRevision ? 'Saving...' : 'Save Revision'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
