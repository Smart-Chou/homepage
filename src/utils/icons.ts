// Icon name → SVG file mapping
// Add new icons here, then reference by name in social.json
export const iconMap: Record<string, string> = {
  github: '/icons/github.svg',
  email: '/icons/email.svg',
  link: '/icons/link.svg',
};

export function getIconPath(name: string): string {
  return iconMap[name] || iconMap['link'];
}
