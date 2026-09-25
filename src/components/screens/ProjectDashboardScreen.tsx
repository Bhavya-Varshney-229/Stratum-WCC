import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  ArrowRight,
  MoreVertical,
  Trash2,
  Copy,
  Edit2,
  Download,
  Archive,
  Compass,
  Target,
  Palette,
  Rocket,
  FileCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  X,
  Filter,
  Sun,
  Moon,
} from 'lucide-react';
import { VentureProject, ProjectType, WorkspaceId } from '../../types/venture';
import {
  calculateProjectProgress,
  firestoreVentureService,
} from '../../services/firestoreVentureService';
import { useAuth } from '../../context/AuthContext';

interface ProjectDashboardScreenProps {
  onOpenProject: (project: VentureProject, targetWorkspace?: WorkspaceId) => void;
  onNewBrand: () => void;
  onNewRebrand: () => void;
  onGoToHome: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const ProjectDashboardScreen: React.FC<ProjectDashboardScreenProps> = ({
  onOpenProject,
  onNewBrand,
  onNewRebrand,
  onGoToHome,
  theme = 'light',
  onToggleTheme,
}) => {
  const { user, showToast } = useAuth();
  const [projects, setProjects] = useState<VentureProject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'new_brand' | 'rebrand' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'progress' | 'title'>('updated');

  // Modal / prompt states
  const [renamingProject, setRenamingProject] = useState<{ id: string; currentTitle: string } | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Subscribe to real-time project updates from Firestore
  useEffect(() => {
    if (!user?.id) {
      firestoreVentureService.getProjectsForUser('').then(setProjects);
      return;
    }

    const unsubscribe = firestoreVentureService.subscribeToUserProjects(
      user.id,
      (list) => {
        setProjects(list);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  // Project Actions
  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await firestoreVentureService.duplicateProject(id, user?.id);
      showToast('Project duplicated successfully in Firestore!', 'success');
    } catch {
      showToast('Failed to duplicate project', 'error');
    }
    setMenuOpenId(null);
  };

  const handleToggleArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await firestoreVentureService.toggleArchiveProject(id);
      showToast(updated?.isArchived ? 'Project moved to archive' : 'Project restored from archive');
    } catch {
      showToast('Failed to update project status', 'error');
    }
    setMenuOpenId(null);
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      await firestoreVentureService.deleteProject(id);
      setDeletingProjectId(null);
      showToast('Project permanently deleted from cloud', 'success');
    } catch {
      showToast('Failed to delete project', 'error');
    }
  };

  const handleStartRename = (project: VentureProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingProject({ id: project.id, currentTitle: project.title });
    setNewTitle(project.title);
    setMenuOpenId(null);
  };

  const handleSaveRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingProject || !newTitle.trim()) return;

    try {
      await firestoreVentureService.renameProject(renamingProject.id, newTitle.trim());
      setRenamingProject(null);
      showToast('Project renamed successfully');
    } catch {
      showToast('Failed to rename project', 'error');
    }
  };

  const handleExportJson = (project: VentureProject, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${project.title.toLowerCase().replace(/\s+/g, '_')}_stratum_project.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setMenuOpenId(null);
    showToast('Project JSON exported successfully');
  };

  // Filter & Search Logic
  const filteredProjects = projects.filter((p) => {
    // Filter type
    if (filterType === 'archived') {
      if (!p.isArchived) return false;
    } else {
      if (p.isArchived) return false;
      if (filterType !== 'all' && p.projectType !== filterType) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchTagline = (p.tagline || '').toLowerCase().includes(q);
      const matchCategory = (p.brandCategory || '').toLowerCase().includes(q);
      const matchIdea = (p.rawIdea || '').toLowerCase().includes(q);
      return matchTitle || matchTagline || matchCategory || matchIdea;
    }

    return true;
  });

  // Sorting Logic
  filteredProjects.sort((a, b) => {
    if (sortBy === 'progress') {
      return calculateProjectProgress(b) - calculateProjectProgress(a);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Stats calculation
  const totalCount = projects.filter((p) => !p.isArchived).length;
  const newBrandsCount = projects.filter((p) => !p.isArchived && p.projectType === 'new_brand').length;
  const rebrandsCount = projects.filter((p) => !p.isArchived && p.projectType === 'rebrand').length;
  const avgProgress = totalCount > 0
    ? Math.round(projects.filter((p) => !p.isArchived).reduce((acc, p) => acc + calculateProjectProgress(p), 0) / totalCount)
    : 0;

  return (
    <div className="min-h-screen bg-[#F1EEE4] dark:bg-[#121212] text-[#1C1917] dark:text-[#F5F3EC] flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="bg-[#FAF8F3] dark:bg-[#161616] border-b border-[#E4DFD3] dark:border-[#2a2a2a] sticky top-0 z-30 px-4 sm:px-6 py-4 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoToHome}
            className="p-1.5 hover:bg-stone-200/60 dark:hover:bg-[#252525] rounded-lg text-stone-600 dark:text-stone-300 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Public Home</span>
          </button>
          <div className="h-4 w-px bg-stone-300 dark:bg-stone-700" />
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 bg-[#FF6124] rounded-lg text-white font-black text-xs flex items-center justify-center">
              ST
            </span>
            <div>
              <h1 className="text-sm font-extrabold text-[#1C1917] dark:text-[#F5F3EC] leading-tight">
                Brand Projects Studio
              </h1>
              <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">
                {user ? `Cloud Workspace of ${user.name}` : 'Multi-Project Management Dashboard'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons & Theme Switcher */}
        <div className="flex items-center gap-2.5">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-[#1e1e1e] border border-[#E4DFD3] dark:border-[#2a2a2a] text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F3EC] transition-colors cursor-pointer shadow-2xs"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>
          )}

          <button
            type="button"
            onClick={onNewBrand}
            className="py-2 px-3.5 bg-[#FF6124] hover:bg-[#E5531B] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Brand</span>
          </button>

          <button
            type="button"
            onClick={onNewRebrand}
            className="py-2 px-3.5 bg-white dark:bg-[#1e1e1e] hover:bg-stone-50 dark:hover:bg-[#252525] border border-[#E4DFD3] dark:border-[#2d2d2d] text-[#1C1917] dark:text-[#F5F3EC] text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF6124]" />
            <span className="hidden sm:inline">Rebrand Business</span>
            <span className="sm:hidden">Rebrand</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Active Projects
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#1C1917] dark:text-[#F5F3EC] font-mono">{totalCount}</span>
              <span className="text-xs text-[#57534E] dark:text-[#A8A29E]">Stored in Firestore</span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6124]">
              New Brands
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#FF6124] font-mono">{newBrandsCount}</span>
              <span className="text-xs text-[#57534E] dark:text-[#A8A29E]">Greenfield</span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Rebrand Audits
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{rebrandsCount}</span>
              <span className="text-xs text-[#57534E] dark:text-[#A8A29E]">Modernized</span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Average Progress
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">{avgProgress}%</span>
              <span className="text-xs text-[#57534E] dark:text-[#A8A29E]">Across 5 stages</span>
            </div>
          </div>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1a1a] p-3 sm:p-4 rounded-2xl border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tagline, or keyword..."
              className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-xl text-xs text-[#1C1917] dark:text-[#F5F3EC] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-hidden focus:border-[#FF6124]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] shadow-2xs'
                  : 'bg-[#FAF8F3] dark:bg-[#202020] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-[#E4DFD3] dark:border-[#2e2e2e]'
              }`}
            >
              All Projects ({projects.filter((p) => !p.isArchived).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('new_brand')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterType === 'new_brand'
                  ? 'bg-[#FF6124] text-white shadow-2xs'
                  : 'bg-[#FAF8F3] dark:bg-[#202020] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-[#E4DFD3] dark:border-[#2e2e2e]'
              }`}
            >
              New Brands ({newBrandsCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('rebrand')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterType === 'rebrand'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-[#FAF8F3] dark:bg-[#202020] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-[#E4DFD3] dark:border-[#2e2e2e]'
              }`}
            >
              Rebranding ({rebrandsCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('archived')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterType === 'archived'
                  ? 'bg-stone-600 text-white shadow-2xs'
                  : 'bg-[#FAF8F3] dark:bg-[#202020] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-[#E4DFD3] dark:border-[#2e2e2e]'
              }`}
            >
              Archived ({projects.filter((p) => p.isArchived).length})
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-stone-400 font-semibold hidden md:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-2.5 bg-[#FAF8F3] dark:bg-[#202020] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-lg text-xs text-[#1C1917] dark:text-[#F5F3EC] font-semibold focus:outline-hidden"
            >
              <option value="updated">Recently Updated</option>
              <option value="progress">Highest Progress</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-3xl text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#333] text-[#FF6124] flex items-center justify-center mx-auto">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F5F3EC]">No brand projects found</h3>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1">
                {searchQuery
                  ? 'Try adjusting your search criteria or clearing filters.'
                  : 'Start by creating your first brand incubation or business rebrand.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onNewBrand}
                className="py-2.5 px-4 bg-[#FF6124] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create New Brand</span>
              </button>
              <button
                type="button"
                onClick={onNewRebrand}
                className="py-2.5 px-4 bg-[#FAF8F3] dark:bg-[#242424] border border-[#E4DFD3] dark:border-[#333] text-[#1C1917] dark:text-[#F5F3EC] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#FF6124]" />
                <span>Rebrand Business</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => {
              const progress = calculateProjectProgress(proj);
              const isRebrand = proj.projectType === 'rebrand';
              const isMenuOpen = menuOpenId === proj.id;

              return (
                <div
                  key={proj.id}
                  onClick={() => onOpenProject(proj)}
                  className="p-6 bg-white dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2a2a2a] hover:border-[#FF6124]/60 rounded-3xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group relative"
                >
                  {/* Top Bar inside Card */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider ${
                            isRebrand
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60'
                              : 'bg-[#FF6124]/10 dark:bg-[#FF6124]/20 text-[#FF6124] border border-[#FF6124]/20'
                          }`}
                        >
                          {isRebrand ? 'Rebrand' : 'New Brand'}
                        </span>
                        {proj.isArchived && (
                          <span className="text-[10px] font-bold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-[#252525] px-2 py-0.5 rounded-md">
                            Archived
                          </span>
                        )}
                      </div>

                      {/* Dropdown Options Menu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(isMenuOpen ? null : proj.id);
                          }}
                          className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-[#252525] transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-10 cursor-default"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpenId(null);
                              }}
                            />
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#333] rounded-xl shadow-lg z-20 py-1 text-xs text-[#1C1917] dark:text-[#F5F3EC] animate-in fade-in"
                            >
                              <button
                                type="button"
                                onClick={(e) => handleStartRename(proj, e)}
                                className="w-full px-3 py-2 text-left hover:bg-[#FAF8F3] dark:hover:bg-[#2a2a2a] flex items-center gap-2"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                                <span>Rename Project</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDuplicate(proj.id, e)}
                                className="w-full px-3 py-2 text-left hover:bg-[#FAF8F3] dark:hover:bg-[#2a2a2a] flex items-center gap-2"
                              >
                                <Copy className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                                <span>Duplicate Project</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleExportJson(proj, e)}
                                className="w-full px-3 py-2 text-left hover:bg-[#FAF8F3] dark:hover:bg-[#2a2a2a] flex items-center gap-2"
                              >
                                <Download className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                                <span>Export JSON Data</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleToggleArchive(proj.id, e)}
                                className="w-full px-3 py-2 text-left hover:bg-[#FAF8F3] dark:hover:bg-[#2a2a2a] flex items-center gap-2"
                              >
                                <Archive className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                                <span>{proj.isArchived ? 'Unarchive' : 'Archive'}</span>
                              </button>
                              <div className="border-t border-[#E4DFD3] dark:border-[#333] my-1" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingProjectId(proj.id);
                                  setMenuOpenId(null);
                                }}
                                className="w-full px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Project</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-[#1C1917] dark:text-[#F5F3EC] group-hover:text-[#FF6124] transition-colors line-clamp-1">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-[#57534E] dark:text-[#A8A29E] line-clamp-2 mt-1 leading-relaxed">
                        {proj.tagline || proj.rawIdea}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-500 dark:text-stone-400">Stage Progress</span>
                        <span className="font-bold font-mono text-[#1C1917] dark:text-[#F5F3EC]">{progress}%</span>
                      </div>
                      <div className="h-2 bg-[#FAF8F3] dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            progress > 70
                              ? 'bg-emerald-500'
                              : progress > 30
                              ? 'bg-[#FF6124]'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* 5 Workspaces Quick Jump Links */}
                    <div className="pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1.5">
                        Jump to Workspace:
                      </p>
                      <div className="grid grid-cols-5 gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProject(proj, 'research-discovery');
                          }}
                          className="p-1.5 bg-[#FAF8F3] dark:bg-[#222222] hover:bg-[#FF6124]/10 dark:hover:bg-[#FF6124]/20 hover:text-[#FF6124] rounded-lg border border-[#E4DFD3] dark:border-[#2e2e2e] flex flex-col items-center gap-1 transition-colors cursor-pointer"
                          title="01. Research & Discovery"
                        >
                          <Compass className="w-3 h-3 text-[#FF6124]" />
                          <span className="font-bold">01</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProject(proj, 'brand-strategy');
                          }}
                          className="p-1.5 bg-[#FAF8F3] dark:bg-[#222222] hover:bg-[#FF6124]/10 dark:hover:bg-[#FF6124]/20 hover:text-[#FF6124] rounded-lg border border-[#E4DFD3] dark:border-[#2e2e2e] flex flex-col items-center gap-1 transition-colors cursor-pointer"
                          title="02. Brand Strategy"
                        >
                          <Target className="w-3 h-3 text-stone-600 dark:text-stone-400" />
                          <span className="font-bold">02</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProject(proj, 'design-studio');
                          }}
                          className="p-1.5 bg-[#FAF8F3] dark:bg-[#222222] hover:bg-[#FF6124]/10 dark:hover:bg-[#FF6124]/20 hover:text-[#FF6124] rounded-lg border border-[#E4DFD3] dark:border-[#2e2e2e] flex flex-col items-center gap-1 transition-colors cursor-pointer"
                          title="03. Design Studio"
                        >
                          <Palette className="w-3 h-3 text-stone-600 dark:text-stone-400" />
                          <span className="font-bold">03</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProject(proj, 'market-launch');
                          }}
                          className="p-1.5 bg-[#FAF8F3] dark:bg-[#222222] hover:bg-[#FF6124]/10 dark:hover:bg-[#FF6124]/20 hover:text-[#FF6124] rounded-lg border border-[#E4DFD3] dark:border-[#2e2e2e] flex flex-col items-center gap-1 transition-colors cursor-pointer"
                          title="04. Market & Launch"
                        >
                          <Rocket className="w-3 h-3 text-stone-600 dark:text-stone-400" />
                          <span className="font-bold">04</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProject(proj, 'complete-brand-kit');
                          }}
                          className="p-1.5 bg-[#FAF8F3] dark:bg-[#222222] hover:bg-[#FF6124]/10 dark:hover:bg-[#FF6124]/20 hover:text-[#FF6124] rounded-lg border border-[#E4DFD3] dark:border-[#2e2e2e] flex flex-col items-center gap-1 transition-colors cursor-pointer"
                          title="05. Complete Brand Kit"
                        >
                          <FileCheck className="w-3 h-3 text-stone-600 dark:text-stone-400" />
                          <span className="font-bold">05</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="mt-5 pt-3 border-t border-[#E4DFD3] dark:border-[#2a2a2a] flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>Updated {new Date(proj.updatedAt).toLocaleDateString()}</span>
                    </span>

                    <span className="font-bold text-[#FF6124] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Rename Project Modal */}
      {renamingProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-[#FAF8F3] dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC]">Rename Project</h3>
            <form onSubmit={handleSaveRename} className="space-y-4">
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#222222] border border-[#E4DFD3] dark:border-[#333] rounded-xl text-xs font-bold text-[#1C1917] dark:text-[#F5F3EC] focus:outline-hidden focus:border-[#FF6124]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenamingProject(null)}
                  className="px-3 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF6124] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Modal */}
      {deletingProjectId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-[#FAF8F3] dark:bg-[#1a1a1a] border border-[#E4DFD3] dark:border-[#2e2e2e] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F3EC]">Delete Brand Project?</h3>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1">
                This action is permanent and will delete all research cards, visual directions, and launch plans for this project.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProjectId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteConfirm(deletingProjectId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
