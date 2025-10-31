import React from 'react';

// FIX: The original component signature was causing a TypeScript error where the `children` prop
// was not being recognized. Using React.PropsWithChildren correctly types the component to accept children from JSX.
const IconWrapper = ({ children }: React.PropsWithChildren) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {children}
    </svg>
);

export const ClipboardIcon = () => (
    <IconWrapper>
        {/* FIX: Changed SVG attributes to camelCase for JSX compatibility. */}
        {/* FIX: Corrected SVG property `strokeLineCap` to `strokeLinecap` and `strokeLineJoin` to `strokeLinejoin`. */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-8 4h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
    </IconWrapper>
);

export const PasteIcon = () => (
    <IconWrapper>
        {/* FIX: Changed SVG attributes to camelCase for JSX compatibility. */}
        {/* FIX: Corrected SVG property `strokeLineCap` to `strokeLinecap` and `strokeLineJoin` to `strokeLinejoin`. */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </IconWrapper>
);

export const ClearIcon = () => (
    <IconWrapper>
        {/* FIX: Changed SVG attributes to camelCase for JSX compatibility. */}
        {/* FIX: Corrected SVG property `strokeLineCap` to `strokeLinecap` and `strokeLineJoin` to `strokeLinejoin`. */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </IconWrapper>
);

export const CopyIcon = () => (
    <IconWrapper>
        {/* FIX: Changed SVG attributes to camelCase for JSX compatibility. */}
        {/* FIX: Corrected SVG property `strokeLineCap` to `strokeLinecap` and `strokeLineJoin` to `strokeLinejoin`. */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </IconWrapper>
);

export const SaveIcon = () => (
    <IconWrapper>
        {/* FIX: Changed SVG attributes to camelCase for JSX compatibility. */}
        {/* FIX: Corrected SVG property `strokeLineCap` to `strokeLinecap` and `strokeLineJoin` to `strokeLinejoin`. */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </IconWrapper>
);

export const ShareIcon = () => (
    <IconWrapper>
        {/* FIX: Changed SVG attributes to camelCase for JSX compatibility. */}
        {/* FIX: Corrected SVG property `strokeLineCap` to `strokeLinecap` and `strokeLineJoin` to `strokeLinejoin`. */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </IconWrapper>
);

export const CloseIcon = () => (
    <IconWrapper>
        {/* FIX: Changed SVG attributes to camelCase for JSX compatibility. */}
        {/* FIX: Corrected SVG property `strokeLineCap` to `strokeLinecap` and `strokeLineJoin` to `strokeLinejoin`. */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </IconWrapper>
);

export const UploadIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </IconWrapper>
);
