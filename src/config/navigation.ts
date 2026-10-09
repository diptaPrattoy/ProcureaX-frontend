export const publicNavigation = [
  { label: "Platform", href: "/platform" },
  { label: "Company", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
] as const;

export const footerNavigation = {
  platform: [
    { label: "Overview", href: "/platform" },
    { label: "Buyer workspace", href: "/platform#buyers" },
    { label: "Supplier workspace", href: "/platform#suppliers" },
    { label: "Admin controls", href: "/platform#administrators" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Frequently asked questions", href: "/faq" },
  ],
} as const;
