export type Author = {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  location?: string;
  social?: {
    label: string;
    href: string;
  }[];
};

export type ContributorProfile = {
  name: string;
  email: string;
  bio: string;
  profileUrl?: string;
};
