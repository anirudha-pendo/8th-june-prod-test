export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string;
  createdAt: string | Date;
  logo?: string | null;
  metadata?: unknown;
};

export type Note = {
  id: string;
  userId: string;
  organizationId: string;
  title: string;
  content: unknown;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type NotesResponse = {
  notes: Note[];
  organization: OrganizationSummary;
};

export type SettingsResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
  };
  organization: OrganizationSummary;
};
