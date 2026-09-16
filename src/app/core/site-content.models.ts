export interface SiteAction {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export interface NavigationItem extends SiteAction {
  readonly key: string;
}

export interface NewsItem {
  readonly key: string;
  readonly category: string;
  readonly date: string;
  readonly title: string;
  readonly summary: string;
  readonly href: string;
  /** Base filename (no extension) under `/media/{concept}/`, e.g. resolved as `/media/${concept}/${image}.webp`. */
  readonly image: string;
}

export interface EventItem {
  readonly key: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly meta: string;
  readonly bDateRail: {
    readonly year: string;
    readonly date: string;
    readonly day: string;
  };
  readonly bDescription: string;
  readonly primaryAction: SiteAction;
  readonly secondaryAction: SiteAction;
}

export interface ResourceItem extends SiteAction {
  readonly key: string;
  readonly title: string;
  readonly description: string;
  readonly symbol: string;
}

export interface MemberAction extends SiteAction {
  readonly key: string;
  readonly title: string;
  readonly symbol: string;
  readonly emphasis: 'primary' | 'secondary' | 'tertiary';
  /** Concept B card body copy; `label` stays the call-to-action beside the arrow. */
  readonly bDescription: string;
}

export interface SiteContent {
  readonly name: string;
  readonly website: string;
  readonly navigation: readonly NavigationItem[];
  readonly hero: {
    readonly title: string;
    readonly description: string;
    readonly primaryAction: SiteAction;
    readonly secondaryAction: SiteAction;
  };
  readonly quickAccess: readonly ResourceItem[];
  readonly events: readonly EventItem[];
  readonly bReference: {
    readonly eventsLead: string;
    readonly eventsArchive: SiteAction;
    readonly eventsCaption: string;
    readonly eventsCaptionMeta: string;
    readonly resourcesLead: string;
    readonly newsLead: string;
    readonly membershipHeading: string;
  };
  readonly news: readonly NewsItem[];
  readonly resources: readonly ResourceItem[];
  readonly memberActions: readonly MemberAction[];
}
