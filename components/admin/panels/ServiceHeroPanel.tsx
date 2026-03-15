/**
 * ServiceHeroPanel — Admin form panel for insurance service page heroes.
 *
 * Renders when formData.serviceHero exists.
 * Matches the InsuranceHero component variants:
 *   - 'centered' (no image — default)
 *   - 'split-image' (when image is set)
 *
 * The image field uses the same ImagePicker as the medical site's HeroPanel.
 */

interface StatItem { value: string; label: string; suffix?: string; }
interface CtaItem  { label: string; href: string; }

interface ServiceHeroPanelProps {
  serviceHero: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

const INPUT_CLS = 'mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none';
const LABEL_CLS = 'block text-xs font-medium text-gray-600 mb-1';
const SECTION_CLS = 'border border-gray-200 rounded-lg p-4 space-y-3';
const SECTION_TITLE_CLS = 'text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2';

export function ServiceHeroPanel({ serviceHero, updateFormValue, openImagePicker }: ServiceHeroPanelProps) {
  const hasImage = Boolean(serviceHero.image);

  const updateStat = (i: number, field: keyof StatItem, val: string) => {
    const stats = Array.isArray(serviceHero.stats) ? [...serviceHero.stats] : [];
    if (!stats[i]) stats[i] = { value: '', label: '', suffix: '' };
    stats[i] = { ...stats[i], [field]: val };
    updateFormValue(['serviceHero', 'stats'], stats);
  };

  const addStat = () => {
    const stats = Array.isArray(serviceHero.stats) ? [...serviceHero.stats] : [];
    updateFormValue(['serviceHero', 'stats'], [...stats, { value: '', label: '', suffix: '' }]);
  };

  const removeStat = (i: number) => {
    const stats = Array.isArray(serviceHero.stats) ? [...serviceHero.stats] : [];
    updateFormValue(['serviceHero', 'stats'], stats.filter((_: any, idx: number) => idx !== i));
  };

  return (
    <div className="space-y-4">

      {/* ── Section header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-sm">Hero Section</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${hasImage ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
          {hasImage ? '🖼 Split-Image Variant' : '⬛ Centered Variant (no image)'}
        </span>
      </div>

      {/* ── Basic copy ──────────────────────────────────────────── */}
      <div className={SECTION_CLS}>
        <p className={SECTION_TITLE_CLS}>
          <span>📝</span> Copy
        </p>

        <div>
          <label className={LABEL_CLS}>Badge Label <span className="text-gray-400">(small eyebrow text)</span></label>
          <input
            className={INPUT_CLS}
            placeholder="e.g. Personal Auto Insurance"
            value={serviceHero.badge || ''}
            onChange={e => updateFormValue(['serviceHero', 'badge'], e.target.value)}
          />
        </div>

        <div>
          <label className={LABEL_CLS}>Headline *</label>
          <input
            className={INPUT_CLS}
            placeholder="e.g. Auto Insurance in Flushing, NY"
            value={serviceHero.headline || ''}
            onChange={e => updateFormValue(['serviceHero', 'headline'], e.target.value)}
          />
        </div>

        <div>
          <label className={LABEL_CLS}>Subline <span className="text-gray-400">(supporting sentence)</span></label>
          <textarea
            className={INPUT_CLS}
            rows={2}
            placeholder="e.g. We compare 30+ carriers so you don't have to."
            value={serviceHero.subline || ''}
            onChange={e => updateFormValue(['serviceHero', 'subline'], e.target.value)}
          />
        </div>
      </div>

      {/* ── Hero Image ──────────────────────────────────────────── */}
      <div className={SECTION_CLS}>
        <p className={SECTION_TITLE_CLS}>
          <span>🖼</span> Hero Image
          <span className="text-gray-400 normal-case text-xs font-normal ml-1">— adds image on right side</span>
        </p>

        <div>
          <label className={LABEL_CLS}>Image URL</label>
          <div className="mt-1 flex gap-2">
            <input
              className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Leave empty for centered text-only hero"
              value={serviceHero.image || ''}
              onChange={e => updateFormValue(['serviceHero', 'image'], e.target.value)}
            />
            <button
              type="button"
              onClick={() => openImagePicker(['serviceHero', 'image'])}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>🖼</span> Choose
            </button>
          </div>
          {serviceHero.image && (
            <div className="mt-2 flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={serviceHero.image}
                alt="Hero preview"
                className="w-24 h-16 object-cover rounded border border-gray-200"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <button
                type="button"
                onClick={() => updateFormValue(['serviceHero', 'image'], '')}
                className="text-xs text-red-500 hover:text-red-700 mt-1"
              >
                ✕ Remove image (switch to centered variant)
              </button>
            </div>
          )}
        </div>

        <div>
          <label className={LABEL_CLS}>Image Alt Text</label>
          <input
            className={INPUT_CLS}
            placeholder="e.g. Auto insurance broker in Flushing NY"
            value={serviceHero.imageAlt || ''}
            onChange={e => updateFormValue(['serviceHero', 'imageAlt'], e.target.value)}
          />
        </div>
      </div>

      {/* ── Stat Pills ──────────────────────────────────────────── */}
      <div className={SECTION_CLS}>
        <div className="flex items-center justify-between mb-1">
          <p className={SECTION_TITLE_CLS} style={{ margin: 0 }}>
            <span>📊</span> Stat Pills <span className="text-gray-400 normal-case font-normal">(shown below subline)</span>
          </p>
          <button
            type="button"
            onClick={addStat}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add Stat
          </button>
        </div>

        {(!serviceHero.stats || serviceHero.stats.length === 0) && (
          <p className="text-xs text-gray-400 italic">No stats — defaults used (30+ Carriers, 2hr Quote, NY·NJ·CT·PA)</p>
        )}

        <div className="space-y-2">
          {(serviceHero.stats || []).map((stat: StatItem, i: number) => (
            <div key={i} className="flex items-end gap-2 bg-gray-50 rounded-md p-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-0.5">Value</label>
                <input
                  className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
                  placeholder="30"
                  value={stat.value || ''}
                  onChange={e => updateStat(i, 'value', e.target.value)}
                />
              </div>
              <div className="w-12">
                <label className="block text-xs text-gray-400 mb-0.5">Suffix</label>
                <input
                  className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
                  placeholder="+"
                  value={stat.suffix || ''}
                  onChange={e => updateStat(i, 'suffix', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-0.5">Label</label>
                <input
                  className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
                  placeholder="Carriers"
                  value={stat.label || ''}
                  onChange={e => updateStat(i, 'label', e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeStat(i)}
                className="pb-1.5 text-red-400 hover:text-red-600 text-base leading-none"
                title="Remove stat"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Buttons ─────────────────────────────────────────── */}
      <div className={SECTION_CLS}>
        <p className={SECTION_TITLE_CLS}><span>🔘</span> Call-to-Action Buttons</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLS}>Primary Button Label</label>
            <input
              className={INPUT_CLS}
              placeholder="Get an Auto Quote"
              value={serviceHero.ctaPrimary?.label || ''}
              onChange={e => updateFormValue(['serviceHero', 'ctaPrimary', 'label'], e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Primary Button Link</label>
            <input
              className={INPUT_CLS}
              placeholder="/en/quote?type=auto"
              value={serviceHero.ctaPrimary?.href || ''}
              onChange={e => updateFormValue(['serviceHero', 'ctaPrimary', 'href'], e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <label className={LABEL_CLS}>Secondary Button Label</label>
            <input
              className={INPUT_CLS}
              placeholder="Call (718) 799-0472"
              value={serviceHero.ctaSecondary?.label || ''}
              onChange={e => updateFormValue(['serviceHero', 'ctaSecondary', 'label'], e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Secondary Button Link</label>
            <input
              className={INPUT_CLS}
              placeholder="tel:+17187990472"
              value={serviceHero.ctaSecondary?.href || ''}
              onChange={e => updateFormValue(['serviceHero', 'ctaSecondary', 'href'], e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Variant info ────────────────────────────────────────── */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
        <p className="font-semibold mb-1">💡 Hero Variant Logic</p>
        <ul className="space-y-0.5 text-blue-600">
          <li>• <strong>No image set</strong> → Centered variant (all text centered on navy background)</li>
          <li>• <strong>Image set</strong> → Split-image variant (text left, photo right)</li>
          <li>• Upload photos via the <strong>Media Library</strong> (/admin/media) then paste the URL above or click Choose</li>
        </ul>
      </div>

    </div>
  );
}
