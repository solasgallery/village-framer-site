export type EditorialSection = { heading: string; body: string };
export type EditorialPage = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: EditorialSection[];
  relatedLinks: { label: string; href: string }[];
};
