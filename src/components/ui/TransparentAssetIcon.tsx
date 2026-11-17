import React, { useEffect, useState } from 'react';

export type IconAlphaMode =
  | 'gold'
  | 'calendar'
  | 'store-card'
  | 'friends'
  | 'white-nav'
  | 'store-nav'
  | 'bell';

export interface TransparentAssetIconProps {
  src: string;
  cropX: number;
  cropY: number;
  cropW: number;
  cropH: number;
  mode: IconAlphaMode;
  className?: string;
  style?: React.CSSProperties;
}

const processedIconCache = new Map<string, string>();

function computeIconAlphaAndUnpremultiply(
  data: Uint8ClampedArray,
  cropX: number,
  cropY: number,
  cropW: number,
  cropH: number,
  mode: IconAlphaMode
): void {
  // Sample background reference from top-left and bottom-left corners of the crop
  const tlR = data[0];
  const tlG = data[1];
  const tlB = data[2];
  const blIdx = (cropH - 1) * cropW * 4;
  const blR = data[blIdx];
  const blG = data[blIdx + 1];
  const blB = data[blIdx + 2];

  for (let y = 0; y < cropH; y++) {
    const ty = y / Math.max(1, cropH - 1);
    const bgR = tlR * (1 - ty) + blR * ty;
    const bgG = tlG * (1 - ty) + blG * ty;
    const bgB = tlB * (1 - ty) + blB * ty;

    // Smooth 3px border safety feather so crop rectangle edges can never be visible
    const edgeDistY = Math.min(y, cropH - 1 - y);
    const edgeFactorY = edgeDistY < 3 ? edgeDistY / 3 : 1;

    for (let x = 0; x < cropW; x++) {
      const edgeDistX = Math.min(x, cropW - 1 - x);
      const edgeFactor = Math.min(edgeFactorY, edgeDistX < 3 ? edgeDistX / 3 : 1);

      const idx = (y * cropW + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const sx = cropX + x;
      const sy = cropY + y;

      let signal = 0;

      if (mode === 'gold') {
        // Warm gold/amber trophy or house vs cold cyan/teal background
        signal = Math.max(0, r - b * 0.72 - 38);
      } else if (mode === 'calendar') {
        // Protect dark checkmark inside the white calendar body
        const inCheckmark = sx >= 175 && sx <= 258 && sy >= 85 && sy <= 148;
        signal = inCheckmark ? 255 : Math.max(0, r - 34);
      } else if (mode === 'store-card') {
        // Protect dark teal window inside the gold store frame
        const inStoreWindow = sx >= 156 && sx <= 264 && sy >= 112 && sy >= 164;
        signal = inStoreWindow ? 255 : Math.max(0, r - 64);
      } else if (mode === 'friends') {
        // Sky-blue glossy 3D figures vs emerald green card background
        signal = Math.max(0, (b - g * 0.85) * 2.25 - 22, r - 35);
      } else if (mode === 'white-nav') {
        // Protect dark D-pad & buttons inside white gamepad body
        const inGamepadInterior = sx >= 46 && sx <= 104 && sy >= 78 && sy <= 116;
        signal = inGamepadInterior ? 255 : Math.max(0, r - 32);
      } else if (mode === 'store-nav') {
        // Protect interior window inside bottom-nav store icon
        const inNavStoreWindow = sx >= 46 && sx <= 104 && sy >= 100 && sy >= 140;
        signal = inNavStoreWindow ? 255 : Math.max(0, r - 42);
      } else if (mode === 'bell') {
        // Exclude top-right static red badge (sx >= 88 && sy <= 74) and keep 3D white bell
        if (sx >= 88 && sy <= 74) {
          signal = 0;
        } else {
          const inBellClapper = sx >= 60 && sx <= 88 && sy >= 100 && sy <= 118;
          signal = inBellClapper ? 255 : Math.max(0, r - 34);
        }
      }

      const rawAlpha = Math.min(255, Math.max(0, Math.round(signal * 3.4 * edgeFactor)));

      if (rawAlpha === 0) {
        data[idx + 3] = 0;
      } else if (rawAlpha < 255) {
        // Un-premultiply background color from semi-transparent edge pixels to prevent dark halo
        const aNorm = Math.max(0.15, rawAlpha / 255);
        data[idx] = Math.min(255, Math.max(0, Math.round((r - bgR * (1 - aNorm)) / aNorm)));
        data[idx + 1] = Math.min(255, Math.max(0, Math.round((g - bgG * (1 - aNorm)) / aNorm)));
        data[idx + 2] = Math.min(255, Math.max(0, Math.round((b - bgB * (1 - aNorm)) / aNorm)));
        data[idx + 3] = rawAlpha;
      } else {
        data[idx + 3] = 255;
      }
    }
  }
}

export const TransparentAssetIcon: React.FC<TransparentAssetIconProps> = ({
  src,
  cropX,
  cropY,
  cropW,
  cropH,
  mode,
  className = '',
  style,
}) => {
  const cacheKey = `${src}:${cropX},${cropY},${cropW},${cropH}:${mode}`;
  const [dataUrl, setDataUrl] = useState<string | null>(() =>
    processedIconCache.get(cacheKey) ?? null
  );

  useEffect(() => {
    const cached = processedIconCache.get(cacheKey);
    if (cached) {
      setDataUrl(cached);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = cropW;
        canvas.height = cropH;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        const imageData = ctx.getImageData(0, 0, cropW, cropH);
        computeIconAlphaAndUnpremultiply(
          imageData.data,
          cropX,
          cropY,
          cropW,
          cropH,
          mode
        );
        ctx.putImageData(imageData, 0, 0);

        const url = canvas.toDataURL('image/png');
        processedIconCache.set(cacheKey, url);
        if (!cancelled) {
          setDataUrl(url);
        }
      } catch {
        // Fallback if canvas is unavailable
      }
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [cacheKey, src, cropX, cropY, cropW, cropH, mode]);

  if (!dataUrl) {
    return (
      <div
        style={{ aspectRatio: `${cropW} / ${cropH}`, ...style }}
        className={`shrink-0 select-none pointer-events-none ${className}`}
      />
    );
  }

  return (
    <img
      src={dataUrl}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{ aspectRatio: `${cropW} / ${cropH}`, ...style }}
      className={`shrink-0 object-contain select-none pointer-events-none ${className}`}
    />
  );
};
