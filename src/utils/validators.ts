export function isURL(url: string) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query ing
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return pattern.test(url);
}

export function isHEX(color: string) {
  const pattern = /^#([0-9a-f]{3}){1,2}$/i;

  return pattern.test(color);
}
