export const slugify = (value = "") =>
  String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const createUniqueSlug = async ({
  model,
  source,
  excludeId = null,
  fallback = "item",
}) => {
  const base = slugify(source) || fallback;
  let slug = base;
  let count = 1;

  const slugExists = async (candidate) => {
    const query = { slug: candidate };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    return model.exists(query);
  };

  while (await slugExists(slug)) {
    slug = `${base}-${count}`;
    count += 1;
  }

  return slug;
};