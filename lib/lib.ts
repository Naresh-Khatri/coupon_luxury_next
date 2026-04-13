export const convertCanvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob));
  });

export const domain =
  process.env.domain || "https://apiv2.couponluxury.com";
