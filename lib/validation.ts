import type { ContentBlock } from "@/types/article";
import type { FieldErrors, SubmissionDraft } from "@/types/submission";
import { isCategorySlug } from "@/data/category-lookup";
import { SUBMISSION_LIMITS } from "./constants";
import { contentWordCount } from "./utils";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string) {
  return emailPattern.test(value.trim());
}

export function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function validateImageFile(file: { type: string; size: number }) {
  if (!(SUBMISSION_LIMITS.acceptedImageTypes as readonly string[]).includes(file.type)) {
    return "Use a JPG, PNG or WebP image.";
  }
  if (file.size > SUBMISSION_LIMITS.maxImageBytes) {
    return `Images must be smaller than ${SUBMISSION_LIMITS.maxImageBytes / 1024 / 1024} MB.`;
  }
  return null;
}

export function validateTag(tag: string, existing: string[]) {
  const trimmed = tag.trim();
  if (!trimmed) return "Tag cannot be empty.";
  if (trimmed.length > SUBMISSION_LIMITS.tagMaxLength) return `Tags must be ${SUBMISSION_LIMITS.tagMaxLength} characters or fewer.`;
  if (existing.some((item) => item.toLowerCase() === trimmed.toLowerCase())) return "That tag is already added.";
  if (existing.length >= SUBMISSION_LIMITS.maxTags) return `You can add up to ${SUBMISSION_LIMITS.maxTags} tags.`;
  return null;
}

function validateBlocks(blocks: ContentBlock[], errors: FieldErrors) {
  blocks.forEach((block) => {
    if (block.type === "image") {
      if (!block.src) errors[`block:${block.id}`] = "Upload an image or remove this image block.";
      else if (!block.alt.trim()) errors[`block:${block.id}`] = "Add alt text that describes the image.";
    }
    if (block.type === "link" && block.href && !isValidUrl(block.href) && !block.href.startsWith("/")) {
      errors[`block:${block.id}`] = "Enter a full link starting with https://";
    }
    if (block.type === "embed" && block.url && !isValidUrl(block.url)) {
      errors[`block:${block.id}`] = "Enter a valid media URL.";
    }
  });
}

export function validateSubmission(draft: SubmissionDraft): FieldErrors {
  const errors: FieldErrors = {};
  const limits = SUBMISSION_LIMITS;
  const title = draft.title.trim();
  const excerpt = draft.excerpt.trim();

  if (!title) errors.title = "Add a title for your article.";
  else if (title.length < limits.titleMin) errors.title = `Titles need at least ${limits.titleMin} characters.`;
  else if (title.length > limits.titleMax) errors.title = `Keep the title under ${limits.titleMax} characters.`;

  if (!excerpt) errors.excerpt = "Write a short description of the article.";
  else if (excerpt.length < limits.excerptMin) errors.excerpt = `The description needs at least ${limits.excerptMin} characters.`;
  else if (excerpt.length > limits.excerptMax) errors.excerpt = `Keep the description under ${limits.excerptMax} characters.`;

  if (!draft.category || !isCategorySlug(draft.category)) errors.category = "Choose a category.";
  if (draft.tags.length === 0) errors.tags = "Add at least one tag.";
  else if (draft.tags.length > limits.maxTags) errors.tags = `Use ${limits.maxTags} tags or fewer.`;

  if (!draft.featuredImage?.src) errors.featuredImage = "Upload a featured image.";
  else if (!draft.featuredImage.alt.trim()) errors.featuredImage = "Describe the featured image in the alt text field.";

  if (!draft.author.name.trim()) errors.authorName = "Enter your name.";
  if (!draft.author.email.trim()) errors.authorEmail = "Enter your email address.";
  else if (!isValidEmail(draft.author.email)) errors.authorEmail = "Enter a valid email address.";
  const bio = draft.author.bio.trim();
  if (!bio) errors.authorBio = "Add a short bio.";
  else if (bio.length < limits.bioMin) errors.authorBio = `Your bio needs at least ${limits.bioMin} characters.`;
  else if (bio.length > limits.bioMax) errors.authorBio = `Keep your bio under ${limits.bioMax} characters.`;
  if (draft.author.profileUrl && !isValidUrl(draft.author.profileUrl)) errors.authorProfile = "Enter a full link starting with https://";

  const words = contentWordCount(draft.content);
  if (draft.content.length === 0 || words === 0) errors.content = "Your article has no content yet.";
  else if (words < limits.minWords) errors.content = `Articles need at least ${limits.minWords} words. You have ${words}.`;

  const imageCount = draft.content.filter((block) => block.type === "image").length;
  if (imageCount > limits.maxImages) errors.content = `Use ${limits.maxImages} images or fewer.`;

  validateBlocks(draft.content, errors);
  return errors;
}
