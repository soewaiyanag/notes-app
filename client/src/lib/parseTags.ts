export function parseTags(input: string): string[] {
  const seen = new Set<string>()
  const tags: string[] = []

  for (const raw of input.split(',')) {
    const tag = raw.trim()
    if (!tag || seen.has(tag.toLowerCase())) continue
    seen.add(tag.toLowerCase())
    tags.push(tag)
  }

  return tags
}
