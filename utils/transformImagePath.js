const transformPath = (src, width = 200) => {
    if (!src) return "";
    const path =
      src.substring(0, src.lastIndexOf("/") + 1) +
      `tr:w-${width}/` +
      src.substring(src.lastIndexOf("/") + 1);
    return path;
  };
  
  export default transformPath;
  