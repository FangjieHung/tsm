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
  readonly href: string;
  /** Base filename (no extension) under `/media/{concept}/`, e.g. resolved as `/media/${concept}/${image}.webp`. */
  readonly image: string;
}

export interface EventItem {
  readonly key: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly meta: string;
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
  readonly news: readonly NewsItem[];
  readonly resources: readonly ResourceItem[];
  readonly memberActions: readonly MemberAction[];
}
