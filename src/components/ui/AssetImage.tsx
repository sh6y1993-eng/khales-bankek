import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AssetImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const AssetImage: React.FC<AssetImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#103D33] to-[#071F19] text-[#D4A243] border border-[#D4A243]/25 ${className}`}
      >
        <Sparkles className="w-5 h-5 opacity-80" aria-hidden="true" />
        {fallbackLabel && (
          <span className="mt-1 text-[10px] font-medium text-[#F7F3E9]/80 px-1 text-center truncate max-w-full">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
