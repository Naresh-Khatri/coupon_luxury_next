export default function transformPath(src: string, width = 200) {
  if (!src) return "";
  return (
    src.substring(0, src.lastIndexOf("/") + 1) +
    `tr:w-${width}/` +
    src.substring(src.lastIndexOf("/") + 1)
  );
}
