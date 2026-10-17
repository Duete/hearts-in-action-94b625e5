import { Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

export type SocialHandle = {
  label: string;
  handle: string;
  href: string;
  icon: React.ElementType;
};

export const socialHandles: SocialHandle[] = [
  {
    label: "Instagram",
    handle: "@globalheartscommunity_ug",
    href: "https://www.instagram.com/globalheartscommunity_ug/",
    icon: Instagram,
  },
  {
    label: "TikTok",
    handle: "@globalheartscommunity",
    href: "https://www.tiktok.com/@globalheartscommunity",
    icon: TikTokIcon,
  },
  {
    label: "Facebook",
    handle: "Global Hearts Community",
    href: "https://www.facebook.com/globalheartscommunity",
    icon: Facebook,
  },
  {
    label: "X",
    handle: "@GHCommunity_Ug",
    href: "https://x.com/GHCommunity_Ug",
    icon: Twitter,
  },
];

export const socialHandlesWithWhatsApp: SocialHandle[] = [
  ...socialHandles,
  {
    label: "WhatsApp",
    handle: "+256 791 481 089",
    href: "https://wa.me/256791481089",
    icon: MessageCircle,
  },
];

type Props = {
  handles?: SocialHandle[];
  className?: string;
};

/** Circular icon buttons, e.g. the Contact page "Follow Us" card. */
export const SocialHandleIcons = ({ handles = socialHandles, className }: Props) => (
  <div className={cn("flex flex-wrap gap-4", className)}>
    {handles.map((social) => (
      <a
        key={social.label}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${social.label} — ${social.handle}`}
        className="bg-primary/10 hover:bg-primary hover:text-primary-foreground p-3 rounded-full transition-smooth"
      >
        <social.icon className="h-5 w-5" />
      </a>
    ))}
  </div>
);

/** Labeled cards showing platform name and handle, e.g. About / News sections. */
export const SocialHandleList = ({ handles = socialHandles, className }: Props) => (
  <ul className={cn("grid gap-3 sm:grid-cols-2", className)}>
    {handles.map((social) => (
      <li key={social.label}>
        <a
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 hover:border-primary hover:shadow-soft transition-smooth"
        >
          <span className="bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground p-2 rounded-md transition-smooth">
            <social.icon className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-foreground">{social.label}</span>
            <span className="block truncate text-sm text-muted-foreground">{social.handle}</span>
          </span>
        </a>
      </li>
    ))}
  </ul>
);

/** Compact text row of handles, e.g. the end of a news article. */
export const SocialHandleInline = ({ handles = socialHandles, className }: Props) => (
  <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
    {handles.map((social) => (
      <a
        key={social.label}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <social.icon className="h-4 w-4" />
        {social.handle}
      </a>
    ))}
  </div>
);
