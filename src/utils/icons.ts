// Icon name → SVG file mapping
// Add new icons here, then reference by name in social.json
export const iconMap: Record<string, string> = {
  github: '/src/components/icons/github.svg',
  email: '/src/components/icons/email.svg',
  link: '/src/components/icons/link.svg',
};

export function getIconPath(name: string): string {
  return iconMap[name] || iconMap['link'];
}
