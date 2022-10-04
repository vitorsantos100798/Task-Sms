type Type = 'png' | 'jpg' | 'jpeg' | 'gif' | 'pdf' | 'doc' | 'mp4';

export function getURLExtension(url: string): Type {
  return url.split(/[#?]/)[0].split('.')?.pop()?.trim() as Type;
}
