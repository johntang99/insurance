interface HomeSectionPhotosPanelProps {
  homePhotoFields: Array<{ path: string[]; label: string }>;
  getPathValue: (path: string[]) => any;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

const HERO_VARIANTS = [
  { value: 'home',                label: '⬛ Centered (no image)' },
  { value: 'gallery-background',  label: '🖼  Full Background Photo' },
  { value: 'split-image',         label: '◧  Text Left + Single Photo Right' },
  { value: 'split-gallery-right', label: '🪟  Text Left + Photo Gallery Right' },
];

export function HomeSectionPhotosPanel({
  homePhotoFields,
  getPathValue,
  updateFormValue,
  openImagePicker,
}: HomeSectionPhotosPanelProps) {
  const currentVariant = String(getPathValue(['hero', 'variant']) || 'home');

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="text-xs font-semibold text-gray-500 uppercase">Home Hero Settings</div>

      {/* ── Hero Variant Selector ─────────────────────────────────── */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">
          Hero Layout Variant
        </label>
        <div className="grid grid-cols-1 gap-2">
          {HERO_VARIANTS.map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => updateFormValue(['hero', 'variant'], v.value)}
              className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                currentVariant === v.value
                  ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {v.label}
              {currentVariant === v.value && (
                <span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">Active</span>
              )}
            </button>
          ))}
        </div>

        {/* Variant descriptions */}
        <div className="mt-2 p-2.5 bg-gray-50 rounded text-xs text-gray-500 leading-relaxed">
          {currentVariant === 'home' && '⬛ Centered: All text centered on navy gradient background. No photo needed.'}
          {currentVariant === 'gallery-background' && '🖼 Full Background: Your photo covers the entire hero. Set "Hero > Background Image" below.'}
          {currentVariant === 'split-image' && '◧ Split Image: Text on left, single photo on right. Set "Hero > Image" below.'}
          {currentVariant === 'split-gallery-right' && '🪟 Gallery: Text on left, photo mosaic (3 photos) on right. Set Gallery Images 1–3 below.'}
        </div>
      </div>

      {/* ── Image fields (auto-detected from JSON structure) ──────── */}
      {homePhotoFields.length > 0 && (
        <div>
          <div className="text-xs font-medium text-gray-600 mb-3">Photo Fields</div>
          <div className="space-y-3">
            {homePhotoFields.map((field) => {
              const isGallery = field.path[0] === 'hero' && field.path[1] === 'galleryImages';
              const isBackground = field.path.includes('backgroundImage');
              const isMainImage = field.path.includes('image') && !isBackground && !isGallery;

              // Show/hide based on active variant
              if (isGallery && currentVariant !== 'split-gallery-right') return null;
              if (isBackground && currentVariant !== 'gallery-background') return null;
              if (isMainImage && field.path[0] === 'hero' && currentVariant !== 'split-image') return null;

              return (
                <div key={field.path.join('.')}
                  className="grid gap-2 items-center"
                  style={{ gridTemplateColumns: '180px 1fr auto auto' }}>
                  <label className="text-xs text-gray-600 truncate" title={field.label}>
                    {isGallery ? `📸 ${field.label}` : field.label}
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    value={String(getPathValue(field.path) || '')}
                    onChange={(event) => updateFormValue(field.path, event.target.value)}
                    placeholder="/uploads/..."
                  />
                  <button
                    type="button"
                    onClick={() => openImagePicker(field.path)}
                    className="px-3 py-2 rounded-md border border-gray-200 text-xs font-medium hover:bg-gray-50 whitespace-nowrap"
                  >
                    Choose
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFormValue(field.path, '')}
                    className="px-3 py-2 rounded-md border border-gray-200 text-xs text-red-500 hover:bg-red-50 whitespace-nowrap"
                  >
                    Clear
                  </button>
                </div>
              );
            })}
          </div>

          {/* Gallery image count hint */}
          {currentVariant === 'split-gallery-right' && (
            <p className="mt-2 text-xs text-gray-400">
              💡 Set 3 photos for the mosaic (top wide + 2 side-by-side below). Optional 4th adds a banner strip.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
