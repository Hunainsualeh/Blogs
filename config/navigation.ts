export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Write for Us", href: "/write-for-us" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export const utilityNavigation = {
  search: { label: "Search", href: "/search" },
  writeForUs: { label: "Write for Us", href: "/write-for-us" },
  submit: { label: "Submit an article", href: "/submit" },
} as const;

export const legalNavigation: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

export const footerCompanyLinks: NavItem[] = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Write for Us", href: "/write-for-us" },
  { label: "Submit an article", href: "/submit" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];
