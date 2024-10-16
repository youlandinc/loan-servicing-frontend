import { ReactNode } from 'react';

export const POSFindLabel = (
  options: Option[],
  val: number | string,
): ReactNode => {
  return options.find((item) => item.value === val)?.label || '';
};

export const POSSVGAnimation = (
  delay: number,
  duration: number,
  strokeWidth: number,
  timingFunction: string,
  strokeColor: string,
  repeat: boolean,
) => {
  const paths: NodeListOf<SVGPathElement> =
    document.querySelectorAll('.loading-svg');
  const mode = repeat ? 'infinite' : 'forwards';
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const length = path.getTotalLength();
    path.style.strokeDashoffset = `${length}px`;
    path.style.strokeDasharray = `${length}px`;
    path.style.strokeWidth = `${strokeWidth}px`;
    path.style.stroke = `${strokeColor}`;
    path.style.animation = `${duration}s svg-text-anim ${mode} ${timingFunction}`;
    path.style.animationDelay = `${i * delay}s`;
  }
};

export const POSGetImageSize = async (
  src: string,
): Promise<{ ratio: number; width: number; height: number } | void> => {
  if (!src) {
    return;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      resolve({ ratio, width, height });
    };
    img.onerror = reject;
  });
};

export const POSGetParamsFromUrl = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const urlObj = new URL(url);
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

export const POSGetRoundedCanvas = (
  sourceCanvas: HTMLCanvasElement,
  xWidth?: number,
  xHeight?: number,
) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const width = xWidth || sourceCanvas.width;
  const height = xHeight || sourceCanvas.height;

  if (!context) {
    return sourceCanvas;
  }

  canvas.width = width;
  canvas.height = height;
  context.imageSmoothingEnabled = true;
  context.drawImage(sourceCanvas, 0, 0, width, height);
  context.globalCompositeOperation = 'destination-in';
  context.beginPath();
  context.fill();
  return canvas;
};

export const createPaymentIframe = (
  signatureData: Record<string, any>,
  dom: HTMLElement,
) => {
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'border: none; width:100%;height: 470px;';
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = process.env.NEXT_PUBLIC_PAYMENT_URL as string;
  Object.keys(signatureData).forEach((item) => {
    const input = document.createElement('input');
    input.name = item;
    input.type = 'hidden';
    input.value = signatureData[item];
    form.appendChild(input);
  });

  dom.innerHTML = '';
  dom.appendChild(iframe);
  iframe.contentWindow?.document.body.appendChild(form);
  form.submit();
};

export const createFile = (data: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(data);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  a.click();
  document.body.removeChild(a);
};
