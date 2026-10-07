import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
);
export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></svg>
);
export const ArrowUpRightIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
);
export const ArrowUpIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></svg>
);
export const ArrowDownIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></svg>
);
export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 6l12 12" /><path d="M18 6 6 18" /></svg>
);
export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 5v14" /><path d="M5 12h14" /></svg>
);
export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M6 7l1 13h10l1-13" /><path d="M9 7V4h6v3" /></svg>
);
export const ImageIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></svg>
);
export const UploadIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
);
export const QuoteIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 7H5v6h4v-2a4 4 0 0 1-4 4" /><path d="M19 7h-4v6h4v-2a4 4 0 0 1-4 4" /></svg>
);
export const ParagraphIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h10" /></svg>
);
export const HeadingIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 4v16" /><path d="M18 4v16" /><path d="M6 12h12" /></svg>
);
export const ListIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 6h11" /><path d="M9 12h11" /><path d="M9 18h11" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></svg>
);
export const OrderedListIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M10 6h10" /><path d="M10 12h10" /><path d="M10 18h10" /><path d="M4 5h1v4" /><path d="M4 15h2l-2 3h2" /></svg>
);
export const CodeIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m8 7-5 5 5 5" /><path d="m16 7 5 5-5 5" /></svg>
);
export const InfoIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></svg>
);
export const AlertIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3 2 20h20L12 3z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>
);
export const LightbulbIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z" /></svg>
);
export const DividerIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 12h18" /><path d="M8 6h8" /><path d="M8 18h8" /></svg>
);
export const LinkIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>
);
export const PlayIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M7 4v16l13-8L7 4z" /></svg>
);
export const EyeIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const PenIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="m14 6 4 4" /></svg>
);
export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m5 12 5 5 9-10" /></svg>
);
export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
);
export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m15 6-6 6 6 6" /></svg>
);
export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>
);
export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const CopyIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>
);
export const MailIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const UserIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const TrendingIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>
);
export const GripIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" /></svg>
);
export const XLogoIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 4l16 16" /><path d="M20 4 4 20" /></svg>
);
export const ShareIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4" /><path d="m15.4 6.5-6.8 4" /></svg>
);
