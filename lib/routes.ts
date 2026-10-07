export function articleHref(slug: string) {
  return `/blog/${slug}`;
}

export function categoryHref(slug: string, page = 1) {
  return page > 1 ? `/category/${slug}/page/${page}` : `/category/${slug}`;
}

export function searchHref(query?: string) {
  return query ? `/search?q=${encodeURIComponent(query)}` : "/search";
}

export function authorAnchor(slug: string) {
  return `/about#${slug}`;
}
