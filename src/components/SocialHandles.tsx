import { Facebook, Instagram, MessageCircle } from "lucide-react";
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

const XIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
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
    icon: XIcon,
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
  {
    label: "WhatsApp",
    handle: "+256784330284",
    href: "https://wa.me/256784330284",
    icon: MessageCircle,
  },
];

type Props = {
  handles?: SocialHandle[];
  className?: string;
};

/** Wrapping icon-and-handle links, e.g. the Contact page "Follow Us" card. */
export const SocialHandleIcons = ({ handles = socialHandlesWithWhatsApp, className }: Props) => (
  <div className={cn("flex min-w-0 flex-wrap items-center gap-2", className)}>
    {handles.map((social) => (
      <a
        key={`${social.label}-${social.handle}`}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${social.label} — ${social.handle}`}
        className="group inline-flex min-h-11 max-w-full min-w-0 items-center gap-2 rounded-sm border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:border-primary hover:text-primary"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-primary">
          <social.icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 break-words">{social.handle}</span>
      </a>
    ))}
  </div>
);

/** Wrapping icon-and-handle links, e.g. About / News sections. */
export const SocialHandleList = ({ handles = socialHandlesWithWhatsApp, className }: Props) => (
  <ul className={cn("flex w-full min-w-0 flex-wrap items-center gap-3", className)}>
    {handles.map((social) => (
      <li key={`${social.label}-${social.handle}`} className="max-w-full min-w-0">
        <a
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${social.label} — ${social.handle}`}
          className="group inline-flex min-h-11 max-w-full min-w-0 items-center gap-2 rounded-sm border border-border bg-background px-3 py-2 transition-colors duration-150 hover:border-primary hover:text-primary"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-primary">
            <social.icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 break-words text-sm text-foreground">{social.handle}</span>
        </a>
      </li>
    ))}
  </ul>
);

/** Compact wrapping icon-and-handle links, e.g. the end of a news article. */
export const SocialHandleInline = ({ handles = socialHandlesWithWhatsApp, className }: Props) => (
  <div className={cn("flex min-w-0 flex-wrap items-center gap-2", className)}>
    {handles.map((social) => (
      <a
        key={`${social.label}-${social.handle}`}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${social.label} — ${social.handle}`}
        className="group inline-flex min-h-10 max-w-full min-w-0 items-center gap-2 rounded-sm border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:border-primary hover:text-primary"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center text-primary">
          <social.icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 break-words">{social.handle}</span>
      </a>
    ))}
  </div>
);
