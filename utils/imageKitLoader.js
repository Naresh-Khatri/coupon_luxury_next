export const imageKitLoader = ({ src, width, quality }) => {
  if (src[0] === "/") src = src.slice(1);
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }
  const paramsString = params.join(",");
  return `${src}?tr=${paramsString}`;
};
