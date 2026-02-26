'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface SiteOption {
  id: string;
  name: string;
}

interface SharedLibraryEditorProps {
  sites: SiteOption[];
  initialSiteId: string;
  canWrite: boolean;
  isSuperAdmin: boolean;
  mode: 'master' | 'profiles';
}

export function SharedLibraryEditor({
  sites,
  initialSiteId,
  canWrite,
  isSuperAdmin,
  mode,
}: SharedLibraryEditorProps) {
  const [selectedSiteId, setSelectedSiteId] = useState(initialSiteId || sites[0]?.id || '');
  const [locale, setLocale] = useState('en');
  const [draft, setDraft] = useState('');
  const [previewDraft, setPreviewDraft] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profilesMode, setProfilesMode] = useState<'full' | 'scoped'>('full');
  const [editableSiteIds, setEditableSiteIds] = useState<string[]>([]);

  const isMasterMode = mode === 'master';
  const canEditMaster = isMasterMode && isSuperAdmin && canWrite;
  const canEditProfiles = !isMasterMode && canWrite;
  const selectedSiteLabel = useMemo(
    () => sites.find((site) => site.id === selectedSiteId)?.name || selectedSiteId,
    [sites, selectedSiteId]
  );

  useEffect(() => {
    setSelectedSiteId(initialSiteId || sites[0]?.id || '');
  }, [initialSiteId, sites]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setStatus(null);
      try {
        if (isMasterMode) {
          const response = await fetch('/api/admin/shared-library/master-services');
          const payload = await response.json();
          if (!response.ok) {
            throw new Error(payload?.message || 'Failed to load master services');
          }
          setDraft(payload.content || '');
          return;
        }

        const query = selectedSiteId
          ? `?siteId=${encodeURIComponent(selectedSiteId)}`
          : '';
        const response = await fetch(
          `/api/admin/shared-library/site-voice-profiles${query}`
        );
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to load voice profiles');
        }
        setProfilesMode(payload.mode === 'scoped' ? 'scoped' : 'full');
        const ids = Array.isArray(payload.editableSiteIds)
          ? payload.editableSiteIds
          : [];
        setEditableSiteIds(ids);
        if (payload.siteId && payload.siteId !== selectedSiteId) {
          setSelectedSiteId(payload.siteId);
        }
        setDraft(payload.content || '');
      } catch (error: any) {
        setStatus(error?.message || 'Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [isMasterMode, selectedSiteId]);

  const handleSave = async () => {
    try {
      setStatus(null);
      JSON.parse(draft);
      const endpoint = isMasterMode
        ? '/api/admin/shared-library/master-services'
        : '/api/admin/shared-library/site-voice-profiles';
      const body = isMasterMode
        ? { content: draft }
        : profilesMode === 'full'
          ? { content: draft }
          : { siteId: selectedSiteId, content: draft };

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || 'Save failed');
      }
      setStatus(payload?.message || 'Saved.');
    } catch (error: any) {
      setStatus(error?.message || 'Invalid JSON');
    }
  };

  const handlePreview = async () => {
    if (!selectedSiteId) return;
    try {
      setStatus(null);
      const body: Record<string, unknown> = { siteId: selectedSiteId };
      if (isMasterMode) {
        JSON.parse(draft);
        body.masterContent = draft;
      } else if (profilesMode === 'full') {
        JSON.parse(draft);
        body.profilesContent = draft;
      } else {
        JSON.parse(draft);
        body.profileContent = draft;
      }
      const response = await fetch('/api/admin/shared-library/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || 'Preview failed');
      }
      setPreviewDraft(JSON.stringify(payload.items || [], null, 2));
      setStatus(`Generated ${payload.count || 0} services for ${selectedSiteLabel}.`);
    } catch (error: any) {
      setStatus(error?.message || 'Preview failed');
    }
  };

  const handleApply = async () => {
    if (!selectedSiteId) return;
    if (
      !window.confirm(
        `Apply generated services to ${selectedSiteId}/${locale}/pages/services.json?`
      )
    ) {
      return;
    }
    try {
      setStatus(null);
      const body: Record<string, unknown> = {
        siteId: selectedSiteId,
        locale,
      };
      if (isMasterMode) {
        JSON.parse(draft);
        body.masterContent = draft;
      } else if (profilesMode === 'full') {
        JSON.parse(draft);
        body.profilesContent = draft;
      } else {
        JSON.parse(draft);
        body.profileContent = draft;
      }
      const response = await fetch('/api/admin/shared-library/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || 'Apply failed');
      }
      setStatus(payload?.message || 'Applied.');
    } catch (error: any) {
      setStatus(error?.message || 'Apply failed');
    }
  };

  const canEdit = isMasterMode ? canEditMaster : canEditProfiles;
  const canRunActions =
    canWrite && !!selectedSiteId && (!isMasterMode || isSuperAdmin);
  const siteOptions =
    profilesMode === 'scoped'
      ? sites.filter((site) => editableSiteIds.includes(site.id))
      : sites;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Shared Library</h1>
        <p className="text-sm text-gray-600">
          Manage cross-site services wording and apply generated items to each site.
        </p>
        <div className="flex gap-2">
          <Link
            href="/admin/shared-library/master-services"
            className={`rounded-md border px-3 py-1.5 text-xs ${
              isMasterMode
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Master Services
          </Link>
          <Link
            href="/admin/shared-library/site-voice-profiles"
            className={`rounded-md border px-3 py-1.5 text-xs ${
              !isMasterMode
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Site Voice Profiles
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm text-gray-700 space-y-1">
            <span className="font-medium">Target site</span>
            <select
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={selectedSiteId}
              onChange={(event) => setSelectedSiteId(event.target.value)}
              disabled={siteOptions.length === 0}
            >
              {siteOptions.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} ({site.id})
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-gray-700 space-y-1">
            <span className="font-medium">Locale (apply target)</span>
            <select
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={locale}
              onChange={(event) => setLocale(event.target.value)}
            >
              <option value="en">en</option>
              <option value="zh">zh</option>
            </select>
          </label>
        </div>
        {status && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {status}
          </div>
        )}
        {!canWrite && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            You have read-only access.
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            {isMasterMode ? 'Master services JSON' : 'Site voice profiles JSON'}
          </h2>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canEdit || isLoading}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Save
          </button>
        </div>
        <textarea
          className="w-full h-72 rounded-md border border-gray-200 px-3 py-2 text-xs font-mono"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={!canEdit || isLoading}
          placeholder={isMasterMode ? '{ "modalities": [] }' : '{ "sites": {} }'}
        />
        {isMasterMode && !isSuperAdmin && (
          <p className="text-xs text-gray-500">
            Only platform admins can edit master services.
          </p>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Generated services preview</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreview}
              disabled={!canRunActions || isLoading}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Generate Preview
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!canRunActions || isLoading}
              className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
            >
              Apply to Site
            </button>
          </div>
        </div>
        <textarea
          className="w-full h-64 rounded-md border border-gray-200 px-3 py-2 text-xs font-mono"
          value={previewDraft}
          onChange={(event) => setPreviewDraft(event.target.value)}
          placeholder="Generated servicesList.items will appear here."
        />
      </div>
    </div>
  );
}
