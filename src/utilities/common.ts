export const getAbsoluteUrl = (
  uri: string | undefined | null,
): string | undefined => {
  if (!uri) {
    return undefined;
  }

  return uri.match(/^http.:\/\//) ? uri : `http://${uri}`;
};

export const isAbsoluteUrl = (uri: string): boolean =>
  !!uri.match(protocolRegex);
const protocolRegex = /^[a-z]+.:\/\//;
