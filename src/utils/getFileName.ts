export function getFileName(name: string, type: string): string {
  if (type === 'png' || type === 'jpg' || type === 'jpeg' || type === 'gif' || type === 'mp4') {
    return `${name}.${type}`;
  }

  if (type === 'pdf') {
    return `${name}.pdf`;
  }

  if (type === 'doc') {
    return `${name}.doc`;
  }

  throw new Error('Invalid type');
}
