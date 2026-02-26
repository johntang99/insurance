'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale, SiteConfig } from '@/lib/types';
import { Button } from '@/components/ui';
import { CONTENT_TEMPLATES } from '@/lib/admin/templates';
import { ImagePickerModal } from '@/components/admin/ImagePickerModal';
import { SeoPanel } from '@/components/admin/panels/SeoPanel';
import { HeaderPanel } from '@/components/admin/panels/HeaderPanel';
import { ThemePanel } from '@/components/admin/panels/ThemePanel';
import { SectionVariantsPanel } from '@/components/admin/panels/SectionVariantsPanel';
import { ConditionsLayoutPanel } from '@/components/admin/panels/ConditionsLayoutPanel';
import { HomeSectionPhotosPanel } from '@/components/admin/panels/HomeSectionPhotosPanel';
import { HeroPanel } from '@/components/admin/panels/HeroPanel';
import { ProfilePanel } from '@/components/admin/panels/ProfilePanel';
import { IntroductionPanel } from '@/components/admin/panels/IntroductionPanel';
import { GalleryPhotosPanel } from '@/components/admin/panels/GalleryPhotosPanel';
import { CtaPanel } from '@/components/admin/panels/CtaPanel';
import { ServicesPanel } from '@/components/admin/panels/ServicesPanel';
import { ConditionsPanel } from '@/components/admin/panels/ConditionsPanel';
import { CaseStudiesPanel } from '@/components/admin/panels/CaseStudiesPanel';
import { PostsPanel } from '@/components/admin/panels/PostsPanel';
import { SECTION_VARIANT_OPTIONS, SITE_SETTINGS_PATHS } from '@/components/admin/utils/editorConstants';
import { getPathValue, toTitleCase } from '@/components/admin/utils/editorHelpers';

interface ContentFileItem {
  id: string;
  label: string;
  path: string;
  scope: 'locale' | 'site';
  publishDate?: string;
}

interface ContentEditorProps {
  sites: SiteConfig[];
  selectedSiteId: string;
  selectedLocale: string;
  initialFilePath?: string;
  fileFilter?: 'all' | 'blog' | 'siteSettings';
  titleOverride?: string;
  basePath?: string;
}


export function ContentEditor({
  sites,
  selectedSiteId,
  selectedLocale,
  initialFilePath,
  fileFilter = 'all',
  titleOverride,
  basePath = '/admin/content',
}: ContentEditorProps) {
  const router = useRouter();
  const [siteId, setSiteId] = useState(selectedSiteId);
  const [locale, setLocale] = useState<Locale>(selectedLocale as Locale);
  const [files, setFiles] = useState<ContentFileItem[]>([]);
  const [activeFile, setActiveFile] = useState<ContentFileItem | null>(null);
  const [content, setContent] = useState('');
  const [formData, setFormData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imageFieldPath, setImageFieldPath] = useState<string[] | null>(null);
  const [markdownPreview, setMarkdownPreview] = useState<Record<string, boolean>>({});
  const [seoPopulating, setSeoPopulating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [blogServiceOptions, setBlogServiceOptions] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [blogConditionOptions, setBlogConditionOptions] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const filesTitle =
    fileFilter === 'blog'
      ? 'Blog Posts'
      : fileFilter === 'siteSettings'
        ? 'Site Settings'
        : 'Files';

  const site = useMemo(
    () => sites.find((item) => item.id === siteId),
    [sites, siteId]
  );

  useEffect(() => {
    if (!site) return;
    if (!site.supportedLocales.includes(locale)) {
      setLocale(site.defaultLocale);
    }
  }, [site, locale]);

  useEffect(() => {
    if (!siteId || !locale) return;
    const params = new URLSearchParams({ siteId, locale });
    router.replace(`${basePath}?${params.toString()}`);
  }, [router, siteId, locale, basePath]);

  const loadFiles = async (preferredPath?: string) => {
    if (!siteId || !locale) return;
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch(
        `/api/admin/content/files?siteId=${siteId}&locale=${locale}`
      );
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.message || 'Failed to load files');
      }
      const payload = await response.json();
      let nextFiles: ContentFileItem[] = payload.files || [];
      if (fileFilter === 'blog') {
        nextFiles = nextFiles.filter((file) => file.path.startsWith('blog/'));
        nextFiles = [...nextFiles].sort((a, b) =>
          (b.publishDate || '').localeCompare(a.publishDate || '')
        );
      } else if (fileFilter === 'siteSettings') {
        nextFiles = nextFiles.filter((file) => SITE_SETTINGS_PATHS.has(file.path));
        nextFiles = [...nextFiles].sort((a, b) => a.label.localeCompare(b.label));
      } else {
        nextFiles = nextFiles.filter(
          (file) => !file.path.startsWith('blog/') && !SITE_SETTINGS_PATHS.has(file.path)
        );
        nextFiles = [...nextFiles].sort((a, b) => a.label.localeCompare(b.label));
      }
      setFiles(nextFiles);
      if (preferredPath) {
        const matched = nextFiles.find((file) => file.path === preferredPath);
        setActiveFile(matched || nextFiles[0] || null);
      } else {
        setActiveFile(nextFiles[0] || null);
      }
    } catch (error: any) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(initialFilePath);
  }, [siteId, locale, initialFilePath, fileFilter]);

  useEffect(() => {
    if (!activeFile) return;
    setLoading(true);
    setStatus(null);
    fetch(
      `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
        activeFile.path
      )}`
    )
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload.message || 'Failed to load content');
        }
        return response.json();
      })
      .then((payload) => {
        const nextContent = payload.content || '';
        setContent(nextContent);
        try {
          setFormData(JSON.parse(nextContent));
        } catch (error) {
          setFormData(null);
        }
      })
      .catch((error) => setStatus(error.message))
      .finally(() => setLoading(false));
  }, [activeFile, siteId, locale]);

  useEffect(() => {
    if (!activeFile) return;
    if (activeFile.path.startsWith('blog/')) {
      loadBlogLinkOptions();
    }
  }, [activeFile, siteId, locale]);

  const handleSave = async () => {
    setStatus(null);
    if (!activeFile) return;
    let parsedContent: Record<string, any>;
    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      setStatus('Invalid JSON. Please fix before saving.');
      return;
    }

    let contentToSave = content;
    if (
      activeFile.path === 'pages/services.json' &&
      parsedContent &&
      typeof parsedContent === 'object' &&
      Array.isArray(parsedContent.servicesList?.items)
    ) {
      // Keep servicesList.items as single source of truth.
      if ('services' in parsedContent) {
        delete parsedContent.services;
      }
      contentToSave = JSON.stringify(parsedContent, null, 2);
      setFormData(parsedContent);
      setContent(contentToSave);
    }

    const response = await fetch('/api/admin/content/file', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        locale,
        path: activeFile.path,
        content: contentToSave,
      }),
    });

    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Save failed');
      return;
    }

    const payload = await response.json();
    setStatus(payload.message || 'Saved');
  };

  const handleImport = async (
    mode: 'missing' | 'overwrite' = 'missing',
    options?: { dryRun?: boolean; force?: boolean }
  ) => {
    setStatus(null);
    setLoading(true);
    setImporting(true);
    try {
      const response = await fetch('/api/admin/content/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          locale,
          mode,
          dryRun: Boolean(options?.dryRun),
          force: Boolean(options?.force),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Import failed');
      }
      if (options?.dryRun) {
        return payload;
      }
      const skipped = payload.skipped || 0;
      const imported = payload.imported || 0;
      setStatus(payload.message || (skipped
        ? `Imported ${imported} items. Skipped ${skipped} existing DB entries.`
        : `Imported ${imported} items from JSON.`));
      await loadFiles(activeFile?.path);
      return payload;
    } catch (error: any) {
      setStatus(error?.message || 'Import failed');
      return null;
    } finally {
      setLoading(false);
      setImporting(false);
    }
  };

  const handleOverwriteImport = async () => {
    const dryRun = await handleImport('overwrite', { dryRun: true });
    if (!dryRun) return;

    const conflicts = Array.isArray(dryRun.conflicts) ? dryRun.conflicts : [];
    if (conflicts.length > 0) {
      const conflictPreview = conflicts
        .slice(0, 5)
        .map((item: any) => `${item.locale}:${item.path}`)
        .join('\n');
      const forceConfirmed = window.confirm(
        `Safety check found ${conflicts.length} newer DB entries.\n\n` +
          `${conflictPreview}${conflicts.length > 5 ? '\n...' : ''}\n\n` +
          'Abort by default. Continue with FORCE overwrite anyway?'
      );
      if (!forceConfirmed) {
        setStatus('Overwrite cancelled due to newer DB entries.');
        return;
      }
      await handleImport('overwrite', { force: true });
      return;
    }

    const confirmed = window.confirm(
      `Dry-run summary:\n` +
        `Create: ${dryRun.toCreate || 0}\n` +
        `Update: ${dryRun.toUpdate || 0}\n` +
        `Unchanged: ${dryRun.unchanged || 0}\n\n` +
        `${Array.isArray(dryRun.toUpdatePaths) && dryRun.toUpdatePaths.length > 0
          ? `Update paths:\n${dryRun.toUpdatePaths.slice(0, 8).join('\n')}${dryRun.toUpdatePaths.length > 8 ? '\n...' : ''}\n\n`
          : ''}` +
        `${Array.isArray(dryRun.toCreatePaths) && dryRun.toCreatePaths.length > 0
          ? `Create paths:\n${dryRun.toCreatePaths.slice(0, 8).join('\n')}${dryRun.toCreatePaths.length > 8 ? '\n...' : ''}\n\n`
          : ''}` +
        'Proceed with overwrite import?'
    );
    if (!confirmed) return;
    await handleImport('overwrite');
  };

  const handleCheckUpdateFromDb = async () => {
    const dryRun = await handleImport('overwrite', { dryRun: true });
    if (!dryRun) return;

    const updatePaths = Array.isArray(dryRun.toUpdatePaths) ? dryRun.toUpdatePaths : [];
    const createPaths = Array.isArray(dryRun.toCreatePaths) ? dryRun.toCreatePaths : [];
    const conflicts = Array.isArray(dryRun.conflicts) ? dryRun.conflicts : [];
    const conflictPaths = conflicts.map((item: any) => `${item.locale}:${item.path}`);

    const allDifferentPaths = Array.from(new Set([...updatePaths, ...createPaths, ...conflictPaths]));
    const preview = allDifferentPaths.slice(0, 20).join('\n');

    window.alert(
      `Check Update From DB\n\n` +
        `Different files: ${allDifferentPaths.length}\n` +
        `Create: ${createPaths.length}\n` +
        `Update: ${updatePaths.length}\n` +
        `DB newer conflicts: ${conflicts.length}\n\n` +
        `${allDifferentPaths.length > 0 ? `Paths:\n${preview}${allDifferentPaths.length > 20 ? '\n...' : ''}` : 'No differences found.'}`
    );

    setStatus(
      allDifferentPaths.length > 0
        ? `Found ${allDifferentPaths.length} files different from DB (create ${createPaths.length}, update ${updatePaths.length}, conflicts ${conflicts.length}).`
        : 'No differences between local JSON and DB.'
    );
  };

  const handleExport = async () => {
    setStatus(null);
    setLoading(true);
    setExporting(true);
    try {
      const response = await fetch('/api/admin/content/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, locale }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Export failed');
      }
      const details = [];
      if (typeof payload.backfilled === 'number') {
        details.push(`backfilled ${payload.backfilled}`);
      }
      if (typeof payload.backfillErrors === 'number' && payload.backfillErrors > 0) {
        details.push(`backfill errors ${payload.backfillErrors}`);
      }
      setStatus(
        `${payload.message || 'Export completed'}${details.length ? ` (${details.join(', ')})` : ''}`
      );
    } catch (error: any) {
      setStatus(error?.message || 'Export failed');
    } finally {
      setLoading(false);
      setExporting(false);
    }
  };

  const handleCreate = async () => {
    const isBlog = fileFilter === 'blog';
    const slug = window.prompt(
      isBlog ? 'New blog slug (example: my-post)' : 'New page slug (example: faq)'
    );
    if (!slug) return;
    const templateId =
      window.prompt(
        `Template: ${CONTENT_TEMPLATES.map((t) => t.id).join(', ')}`,
        CONTENT_TEMPLATES[0]?.id || 'basic'
      ) || CONTENT_TEMPLATES[0]?.id;
    const response = await fetch('/api/admin/content/file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        locale,
        action: 'create',
        slug,
        templateId,
        targetDir: isBlog ? 'blog' : 'pages',
      }),
    });

    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Create failed');
      return;
    }

    const payload = await response.json();
    await loadFiles(payload.path);
  };

  const handleDuplicate = async () => {
    if (!activeFile) return;
    const isBlog = activeFile.path.startsWith('blog/');
    const slug = window.prompt(
      isBlog
        ? 'Duplicate blog slug (example: my-post-copy)'
        : 'Duplicate page slug (example: faq-copy)'
    );
    if (!slug) return;
    const response = await fetch('/api/admin/content/file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        locale,
        action: 'duplicate',
        path: activeFile.path,
        slug,
        targetDir: isBlog ? 'blog' : 'pages',
      }),
    });

    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Duplicate failed');
      return;
    }

    const payload = await response.json();
    await loadFiles(payload.path);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(content);
      const formatted = JSON.stringify(parsed, null, 2);
      setContent(formatted);
      setFormData(parsed);
      setStatus('Formatted');
    } catch (error) {
      setStatus('Invalid JSON. Unable to format.');
    }
  };

  const handleDelete = async () => {
    if (!activeFile) return;
    const confirmed = window.confirm(`Delete ${activeFile.path}? This cannot be undone.`);
    if (!confirmed) return;
    const response = await fetch(
      `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
        activeFile.path
      )}`,
      { method: 'DELETE' }
    );
    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Delete failed');
      return;
    }
    await loadFiles();
  };

  const loadBlogLinkOptions = async () => {
    if (!siteId || !locale) return;
    try {
      const [servicesRes, conditionsRes] = await Promise.all([
        fetch(
          `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
            'pages/services.json'
          )}`
        ),
        fetch(
          `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
            'pages/conditions.json'
          )}`
        ),
      ]);
      const [servicesPayload, conditionsPayload] = await Promise.all([
        servicesRes.ok ? servicesRes.json() : Promise.resolve(null),
        conditionsRes.ok ? conditionsRes.json() : Promise.resolve(null),
      ]);

      const servicesData = servicesPayload?.content
        ? JSON.parse(servicesPayload.content)
        : null;
      const conditionsData = conditionsPayload?.content
        ? JSON.parse(conditionsPayload.content)
        : null;

      const servicesOptions = Array.isArray(servicesData?.services)
        ? servicesData.services
            .map((service: any) => ({
              id: String(service?.id || ''),
              title: String(service?.title || service?.name || ''),
            }))
            .filter((item: any) => item.id && item.title)
        : [];
      const conditionsOptions = Array.isArray(conditionsData?.conditions)
        ? conditionsData.conditions
            .map((condition: any) => ({
              id: String(condition?.id || ''),
              title: String(condition?.title || condition?.name || ''),
            }))
            .filter((item: any) => item.id && item.title)
        : [];

      setBlogServiceOptions(servicesOptions);
      setBlogConditionOptions(conditionsOptions);
    } catch (error) {
      setBlogServiceOptions([]);
      setBlogConditionOptions([]);
    }
  };

  const getPreviewPath = () => {
    if (!activeFile) return `/${locale}`;
    if (activeFile.path.startsWith('pages/')) {
      const slug = activeFile.path.replace('pages/', '').replace('.json', '');
      if (slug === 'home') return `/${locale}`;
      return `/${locale}/${slug}`;
    }
    return `/${locale}`;
  };

  const updateFormValue = (path: string[], value: any) => {
    if (!formData) return;
    const next = { ...formData };
    let cursor: any = next;
    path.forEach((key, index) => {
      if (index === path.length - 1) {
        cursor[key] = value;
      } else {
        cursor[key] = cursor[key] ?? {};
        cursor = cursor[key];
      }
    });
    setFormData(next);
    setContent(JSON.stringify(next, null, 2));
  };

  const openImagePicker = (path: string[]) => {
    setImageFieldPath(path);
    setShowImagePicker(true);
  };

  const handleImageSelect = (url: string) => {
    if (!imageFieldPath) return;
    updateFormValue(imageFieldPath, url);
  };

  const toggleMarkdownPreview = (key: string) => {
    setMarkdownPreview((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const getPathValueLocal = (path: string[]) =>
    getPathValue(formData, path);

  const renderColorField = (label: string, path: string[]) => {
    const value = String(getPathValueLocal(path) || '');
    return (
      <div className="grid gap-2 md:grid-cols-[1fr_auto] items-center">
        <div>
          <label className="block text-xs text-gray-500">{label}</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={value}
            onChange={(event) => updateFormValue(path, event.target.value)}
            placeholder="#000000"
          />
        </div>
        <input
          type="color"
          className="mt-6 h-10 w-10 rounded-md border border-gray-200"
          value={value || '#000000'}
          onChange={(event) => updateFormValue(path, event.target.value)}
          aria-label={`${label} color`}
        />
      </div>
    );
  };

  const isSeoFile = activeFile?.path === 'seo.json';
  const isBlogPostFile = activeFile?.path.startsWith('blog/');
  const isHeaderFile = activeFile?.path === 'header.json';
  const isThemeFile = activeFile?.path === 'theme.json';
  const isHomePageFile = activeFile?.path === 'pages/home.json';
  const isConditionsPageFile = activeFile?.path === 'pages/conditions.json';
  const allowCreateOrDuplicate = fileFilter !== 'siteSettings';
  const variantSections = formData
    ? Object.entries(SECTION_VARIANT_OPTIONS).filter(
        ([key]) =>
          formData[key] &&
          typeof formData[key] === 'object' &&
          !Array.isArray(formData[key])
      )
    : [];
  const galleryCategories = Array.isArray(formData?.categories)
    ? formData.categories
        .map((category: any) => ({
          id: typeof category?.id === 'string' ? category.id : '',
          name: typeof category?.name === 'string' ? category.name : '',
        }))
        .filter((category: any) => category.id && category.name)
    : [];
  const caseStudyCategories = Array.isArray(formData?.categories)
    ? formData.categories
        .map((category: any) => ({
          id: typeof category?.id === 'string' ? category.id : '',
          name: typeof category?.name === 'string' ? category.name : '',
        }))
        .filter((category: any) => category.id && category.name)
    : [];
  const categoryOrderValue = (category: any) => {
    const order = Number(category?.order);
    return Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER;
  };
  const sortedConditionCategories = Array.isArray(formData?.categories)
    ? formData.categories
        .map((category: any, index: number) => ({ category, index }))
        .sort(
          (a, b) =>
            categoryOrderValue(a.category) - categoryOrderValue(b.category) ||
            a.index - b.index
        )
    : [];
  const conditionCategoryOptions = Array.isArray(formData?.categories)
    ? sortedConditionCategories
        .map(({ category }: any) => ({
          id: typeof category?.id === 'string' ? category.id : '',
          name: typeof category?.name === 'string' ? category.name : '',
        }))
        .filter((category: any) => category.id && category.name && category.id !== 'all')
    : [];
  const homePhotoFields = useMemo(() => {
    if (!isHomePageFile || !formData) return [] as Array<{ path: string[]; label: string }>;

    const fields: Array<{ path: string[]; label: string }> = [];
    const IMAGE_KEYS = new Set(['image', 'backgroundImage', 'beforeImage', 'afterImage', 'src']);
    const EXCLUDED_ROOT_KEYS = new Set(['menu', 'topBar', 'topbar']);
    const DISPLAY_KEYS = [
      'title',
      'name',
      'label',
      'condition',
      'businessName',
      'clinicName',
      'tagline',
      'text',
      'id',
      'slug',
    ];

    const getNodeDisplayLabel = (node: any, fallbackIndex?: number) => {
      if (!node || typeof node !== 'object') {
        return typeof fallbackIndex === 'number' ? `Item ${fallbackIndex + 1}` : '';
      }

      for (const key of DISPLAY_KEYS) {
        const value = node?.[key];
        if (typeof value === 'string' && value.trim()) {
          return key === 'id' || key === 'slug' ? toTitleCase(value) : value.trim();
        }
      }

      if (typeof fallbackIndex === 'number') {
        return `Item ${fallbackIndex + 1}`;
      }
      return '';
    };

    const collectFields = (node: any, path: string[] = [], contextHint = '') => {
      if (Array.isArray(node)) {
        node.forEach((item, index) => {
          const itemHint = getNodeDisplayLabel(item, index);
          collectFields(item, [...path, String(index)], itemHint);
        });
        return;
      }

      if (!node || typeof node !== 'object') {
        return;
      }

      Object.entries(node).forEach(([key, value]) => {
        if (path.length === 0 && EXCLUDED_ROOT_KEYS.has(key)) {
          return;
        }

        const nextPath = [...path, key];
        const isImageField = IMAGE_KEYS.has(key);

        if (isImageField && typeof value === 'string') {
          const sectionLabel = nextPath
            .filter((part) => !/^\d+$/.test(part))
            .map((part) => toTitleCase(part))
            .join(' > ');
          const localHint = getNodeDisplayLabel(node);
          const hint = localHint || contextHint;
          const label = hint ? `${sectionLabel} (${hint})` : sectionLabel;
          fields.push({ path: nextPath, label });
          return;
        }

        if (typeof value === 'object' && value !== null) {
          collectFields(value, nextPath, contextHint);
        }
      });
    };

    collectFields(formData);
    return fields;
  }, [isHomePageFile, formData]);

  const addSeoPage = () => {
    if (!formData) return;
    const slug = window.prompt('Page slug (example: services)');
    if (!slug) return;
    updateFormValue(['pages', slug], {
      title: '',
      description: '',
    });
  };

  const removeSeoPage = (slug: string) => {
    if (!formData) return;
    const next = { ...formData };
    if (next.pages && typeof next.pages === 'object') {
      const pages = { ...next.pages };
      delete pages[slug];
      next.pages = pages;
      setFormData(next);
      setContent(JSON.stringify(next, null, 2));
    }
  };

  const addGalleryImage = () => {
    if (!formData) return;
    const images = Array.isArray(formData.images) ? [...formData.images] : [];
    const maxOrder = images.reduce((max: number, image: any) => {
      const order = typeof image?.order === 'number' ? image.order : 0;
      return Math.max(max, order);
    }, 0);
    images.push({
      id: `gallery-${Date.now()}`,
      src: '',
      alt: '',
      title: '',
      category: '',
      description: '',
      featured: false,
      order: maxOrder + 1,
    });
    updateFormValue(['images'], images);
  };

  const removeGalleryImage = (index: number) => {
    if (!formData || !Array.isArray(formData.images)) return;
    const images = [...formData.images];
    images.splice(index, 1);
    updateFormValue(['images'], images);
  };

  const addHeaderMenuItem = () => {
    if (!formData) return;
    const items = Array.isArray(formData.menu?.items) ? [...formData.menu.items] : [];
    items.push({ text: '', url: '' });
    updateFormValue(['menu', 'items'], items);
  };

  const removeHeaderMenuItem = (index: number) => {
    if (!formData || !Array.isArray(formData.menu?.items)) return;
    const items = [...formData.menu.items];
    items.splice(index, 1);
    updateFormValue(['menu', 'items'], items);
  };

  const addHeaderLanguage = () => {
    if (!formData) return;
    const languages = Array.isArray(formData.languages) ? [...formData.languages] : [];
    languages.push({ label: '', locale: '', url: '' });
    updateFormValue(['languages'], languages);
  };

  const removeHeaderLanguage = (index: number) => {
    if (!formData || !Array.isArray(formData.languages)) return;
    const languages = [...formData.languages];
    languages.splice(index, 1);
    updateFormValue(['languages'], languages);
  };

  const toggleSelection = (path: string[], value: string) => {
    if (!formData) return;
    const current = Array.isArray(getPathValue(formData, path))
      ? (getPathValue(formData, path) as string[])
      : [];
    const exists = current.includes(value);
    const next = exists ? current.filter((item) => item !== value) : [...current, value];
    updateFormValue(path, next);
  };

  const addConditionCategory = () => {
    if (!formData) return;
    const categories = Array.isArray(formData.categories) ? [...formData.categories] : [];
    categories.push({
      id: `category-${categories.length + 1}`,
      icon: 'Activity',
      name: '',
      subtitle: '',
      description: '',
      image: '',
      order: categories.length + 1,
    });
    updateFormValue(['categories'], categories);
  };

  const removeConditionCategory = (index: number) => {
    if (!formData || !Array.isArray(formData.categories)) return;
    const categories = [...formData.categories];
    const target = categories[index];
    categories.splice(index, 1);
    const next: Record<string, any> = { ...formData, categories };

    if (target?.id && Array.isArray(formData.conditions)) {
      const fallbackCategory =
        categories.find((category: any) => category?.id && category.id !== 'all')?.id || '';
      next.conditions = formData.conditions.map((condition: any) => {
        if (condition?.category === target.id) {
          return {
            ...condition,
            category: fallbackCategory,
          };
        }
        return condition;
      });
    }

    setFormData(next);
    setContent(JSON.stringify(next, null, 2));
  };

  const addConditionItem = () => {
    if (!formData) return;
    const list = Array.isArray(formData.conditions) ? [...formData.conditions] : [];
    const firstCategory = conditionCategoryOptions[0]?.id || '';
    list.push({
      id: `condition-${list.length + 1}`,
      title: '',
      category: firstCategory,
      icon: 'Activity',
      image: '',
      description: '',
      symptoms: [],
      tcmApproach: '',
      treatmentMethods: [],
      featured: false,
    });
    updateFormValue(['conditions'], list);
  };

  const removeConditionItem = (index: number) => {
    if (!formData || !Array.isArray(formData.conditions)) return;
    const list = [...formData.conditions];
    list.splice(index, 1);
    updateFormValue(['conditions'], list);
  };

  const addServicesListItem = () => {
    if (!formData) return;
    const items = Array.isArray(formData.servicesList?.items) ? [...formData.servicesList.items] : [];
    items.push({
      id: `service-${items.length + 1}`,
      icon: 'Syringe',
      order: items.length + 1,
      title: '',
      shortDescription: '',
      fullDescription: '',
      benefits: [],
      whatToExpect: '',
      image: '',
      featured: false,
    });
    updateFormValue(['servicesList', 'items'], items);
  };

  const removeServicesListItem = (index: number) => {
    if (!formData || !Array.isArray(formData.servicesList?.items)) return;
    const items = [...formData.servicesList.items];
    items.splice(index, 1);
    updateFormValue(['servicesList', 'items'], items);
  };

  const addTrustBarItem = () => {
    if (!formData) return;
    const items = Array.isArray(formData.trustBar?.items) ? [...formData.trustBar.items] : [];
    items.push({
      icon: 'Shield',
      title: '',
      description: '',
    });
    updateFormValue(['trustBar', 'items'], items);
  };

  const removeTrustBarItem = (index: number) => {
    if (!formData || !Array.isArray(formData.trustBar?.items)) return;
    const items = [...formData.trustBar.items];
    items.splice(index, 1);
    updateFormValue(['trustBar', 'items'], items);
  };

  const addRelatedReadingSlug = () => {
    if (!formData) return;
    const slugs = Array.isArray(formData.relatedReading?.preferredSlugs)
      ? [...formData.relatedReading.preferredSlugs]
      : [];
    slugs.push('');
    updateFormValue(['relatedReading', 'preferredSlugs'], slugs);
  };

  const removeRelatedReadingSlug = (index: number) => {
    if (!formData || !Array.isArray(formData.relatedReading?.preferredSlugs)) return;
    const slugs = [...formData.relatedReading.preferredSlugs];
    slugs.splice(index, 1);
    updateFormValue(['relatedReading', 'preferredSlugs'], slugs);
  };

  const populateSeoFromHeroes = async () => {
    if (!formData) return;
    setSeoPopulating(true);
    setStatus(null);
    try {
      const pageFiles = files
        .filter((file) => file.path.startsWith('pages/'))
        .map((file) => ({
          path: file.path,
          slug: file.path.replace('pages/', '').replace('.json', ''),
        }));

      const results = await Promise.all(
        pageFiles.map(async (page) => {
          try {
            const response = await fetch(
              `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
                page.path
              )}`
            );
            if (!response.ok) {
              return null;
            }
            const payload = await response.json();
            const parsed = JSON.parse(payload.content || '{}');
            const hero = parsed?.hero;
            const title = hero?.title;
            const description = hero?.description || hero?.subtitle;
            if (!title && !description) {
              return null;
            }
            return { slug: page.slug, title, description };
          } catch (error) {
            return null;
          }
        })
      );

      const next = { ...formData };
      const pages = typeof next.pages === 'object' && next.pages ? { ...next.pages } : {};

      results.forEach((entry) => {
        if (!entry) return;
        if (entry.slug === 'home') {
          const currentHome = next.home || {};
          next.home = {
            title: currentHome.title || entry.title || '',
            description: currentHome.description || entry.description || '',
          };
          return;
        }

        const current = pages[entry.slug] || {};
        pages[entry.slug] = {
          title: current.title || entry.title || '',
          description: current.description || entry.description || '',
        };
      });

      next.pages = pages;
      setFormData(next);
      setContent(JSON.stringify(next, null, 2));
      setStatus('SEO populated from hero sections.');
    } catch (error: any) {
      setStatus(error?.message || 'Failed to populate SEO.');
    } finally {
      setSeoPopulating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {titleOverride || 'Content Editor'}
          </h1>
          <p className="text-sm text-gray-600">
            Select a site and locale to edit JSON content files.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div>
            <label className="block text-xs font-medium text-gray-500">Site</label>
            <select
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={siteId}
              onChange={(event) => {
                setSiteId(event.target.value);
              }}
            >
              {sites.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Locale</label>
            <select
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
            >
              {(site?.supportedLocales || ['en']).map((item) => (
                <option key={item} value={item}>
                  {item === 'en' ? 'English' : item === 'zh' ? 'Chinese' : item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2 pt-4 sm:pt-0">
            <button
              type="button"
              onClick={() => handleImport('missing')}
              disabled={importing || loading}
              className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              {importing ? 'Importing…' : 'Import JSON'}
            </button>
            <button
              type="button"
              onClick={handleCheckUpdateFromDb}
              disabled={importing || loading}
              className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Check Update From DB
            </button>
            <button
              type="button"
              onClick={handleOverwriteImport}
              disabled={importing || loading}
              className="px-3 py-2 rounded-md border border-amber-200 text-xs text-amber-700 hover:bg-amber-50 disabled:opacity-60"
            >
              {importing ? 'Importing…' : 'Overwrite Import'}
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting || loading}
              className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              {exporting ? 'Exporting…' : 'Export JSON'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
            {filesTitle}
          </div>
          {loading && files.length === 0 ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => setActiveFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    activeFile?.id === file.id
                      ? 'bg-[var(--primary)] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{file.label}</div>
                  <div className="text-xs opacity-70">{file.path}</div>
                  {fileFilter === 'blog' && file.publishDate && (
                    <div className="text-[11px] text-gray-500 mt-1">
                      {new Date(file.publishDate).toLocaleDateString(
                        locale === 'zh' ? 'zh-CN' : 'en-US',
                        { year: 'numeric', month: 'short', day: 'numeric' }
                      )}
                    </div>
                  )}
                </button>
              ))}
              {files.length === 0 && (
                <div className="text-sm text-gray-500">
                  {fileFilter === 'blog'
                    ? 'No blog posts found for this locale.'
                    : 'No content files found for this locale.'}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {activeFile?.label || 'Select a file'}
              </div>
              <div className="text-xs text-gray-500">{activeFile?.path}</div>
            </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.open(getPreviewPath(), '_blank')}
            className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
          >
            Preview
          </button>
          {allowCreateOrDuplicate && (
            <button
              type="button"
              onClick={handleCreate}
              className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
            >
              {fileFilter === 'blog' ? 'New Post' : 'New Page'}
            </button>
          )}
          {allowCreateOrDuplicate && (
            <button
              type="button"
              onClick={handleDuplicate}
              disabled={!activeFile}
              className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Duplicate
            </button>
          )}
          <button
            type="button"
            onClick={handleFormat}
            disabled={!activeFile}
            className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Format
          </button>
          {activeFile &&
            (activeFile.path.startsWith('pages/') ||
              activeFile.path.startsWith('blog/')) && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            )}
          <Button onClick={handleSave} disabled={!activeFile}>
            Save
          </Button>
        </div>
          </div>

          {status && (
            <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {status}
            </div>
          )}

          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-md text-xs ${
                activeTab === 'form'
                  ? 'bg-[var(--primary)] text-white'
                  : 'border border-gray-200 text-gray-700'
              }`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-md text-xs ${
                activeTab === 'json'
                  ? 'bg-[var(--primary)] text-white'
                  : 'border border-gray-200 text-gray-700'
              }`}
            >
              JSON
            </button>
          </div>

          {activeTab === 'form' ? (
            <div className="space-y-6 text-sm">
              {!formData && (
                <div className="text-sm text-gray-500">
                  Invalid JSON. Switch to JSON tab to fix.
                </div>
              )}

              {isSeoFile && formData && (
                <SeoPanel
                  formData={formData}
                  seoPopulating={seoPopulating}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                  populateSeoFromHeroes={populateSeoFromHeroes}
                  addSeoPage={addSeoPage}
                  removeSeoPage={removeSeoPage}
                />
              )}

              {isHeaderFile && formData && (
                <HeaderPanel
                  formData={formData}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                  addHeaderMenuItem={addHeaderMenuItem}
                  removeHeaderMenuItem={removeHeaderMenuItem}
                  addHeaderLanguage={addHeaderLanguage}
                  removeHeaderLanguage={removeHeaderLanguage}
                />
              )}

              {isThemeFile && formData && (
                <ThemePanel
                  getPathValue={getPathValueLocal}
                  updateFormValue={updateFormValue}
                  renderColorField={renderColorField}
                />
              )}

              {formData && variantSections.length > 0 && (
                <SectionVariantsPanel
                  variantSections={variantSections}
                  getPathValue={getPathValueLocal}
                  updateFormValue={updateFormValue}
                />
              )}

              {isConditionsPageFile && formData && (
                <ConditionsLayoutPanel
                  layoutVariant={String(formData.layoutVariant || 'categories-tabs')}
                  updateFormValue={updateFormValue}
                />
              )}

              {isHomePageFile && homePhotoFields.length > 0 && (
                <HomeSectionPhotosPanel
                  homePhotoFields={homePhotoFields}
                  getPathValue={getPathValueLocal}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {formData?.hero && (
                <HeroPanel
                  hero={formData.hero}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {formData?.profile && (
                <ProfilePanel
                  profile={formData.profile}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {formData?.introduction && (
                <IntroductionPanel
                  introduction={formData.introduction}
                  updateFormValue={updateFormValue}
                />
              )}

              {Array.isArray(formData?.images) && (
                <GalleryPhotosPanel
                  images={formData.images}
                  galleryCategories={galleryCategories}
                  addGalleryImage={addGalleryImage}
                  removeGalleryImage={removeGalleryImage}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {formData?.cta && (
                <CtaPanel cta={formData.cta} updateFormValue={updateFormValue} />
              )}

              {(formData?.services || formData?.servicesList || formData?.trustBar || formData?.legacyLabels || formData?.relatedReading) && (
                <ServicesPanel
                  formData={formData}
                  markdownPreview={markdownPreview}
                  toggleMarkdownPreview={toggleMarkdownPreview}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                  addServicesListItem={addServicesListItem}
                  removeServicesListItem={removeServicesListItem}
                  addTrustBarItem={addTrustBarItem}
                  removeTrustBarItem={removeTrustBarItem}
                  addRelatedReadingSlug={addRelatedReadingSlug}
                  removeRelatedReadingSlug={removeRelatedReadingSlug}
                />
              )}

              {isConditionsPageFile && (formData?.categories || formData?.conditions) && (
                <ConditionsPanel
                  isConditionsPageFile={isConditionsPageFile}
                  categories={formData?.categories ?? []}
                  conditions={formData?.conditions ?? []}
                  sortedConditionCategories={sortedConditionCategories}
                  conditionCategoryOptions={conditionCategoryOptions}
                  markdownPreview={markdownPreview}
                  toggleMarkdownPreview={toggleMarkdownPreview}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                  addConditionCategory={addConditionCategory}
                  removeConditionCategory={removeConditionCategory}
                  addConditionItem={addConditionItem}
                  removeConditionItem={removeConditionItem}
                />
              )}

              {Array.isArray(formData?.caseStudies) && (
                <CaseStudiesPanel
                  caseStudies={formData.caseStudies}
                  caseStudyCategories={caseStudyCategories}
                  markdownPreview={markdownPreview}
                  toggleMarkdownPreview={toggleMarkdownPreview}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}


              {(formData?.featuredPost || Array.isArray(formData?.posts) || formData?.slug) && (
                <PostsPanel
                  formData={formData}
                  isBlogPostFile={!!isBlogPostFile}
                  blogServiceOptions={blogServiceOptions}
                  blogConditionOptions={blogConditionOptions}
                  markdownPreview={markdownPreview}
                  toggleMarkdownPreview={toggleMarkdownPreview}
                  toggleSelection={toggleSelection}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {formData && !formData.hero && !formData.introduction && !formData.cta && (
                <div className="text-sm text-gray-500">
                  No schema panels available for this file yet. Use the JSON tab.
                </div>
              )}
            </div>
          ) : (
            <textarea
              className="w-full min-h-[520px] rounded-lg border border-gray-200 p-3 font-mono text-xs text-gray-800"
              value={content}
              onChange={(event) => {
                const next = event.target.value;
                setContent(next);
                try {
                  setFormData(JSON.parse(next));
                } catch (error) {
                  setFormData(null);
                }
              }}
              placeholder="Select a file to begin editing."
            />
          )}
        </div>
      </div>
      <ImagePickerModal
        open={showImagePicker}
        siteId={siteId}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
