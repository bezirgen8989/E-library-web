export const volumeSliderStyles = {
  track: {
    color: "white",
    background: "white",
  },
  rail: {
    background: "grey",
  },
  handle: {
    color: "white",
    background: "white",
  },
};

export const defaultVideoOptions = {
  autoPlay: true,
  playsInline: false,
  muted: false,
};

export enum VolumeRange {
  MAX = 100,
  MIN = 0,
}

export const getIdFromUrl = (url: string) => {
  const searchParams = new URLSearchParams(new URL(url).search);
  const streamValue = searchParams.get("stream");

  return streamValue || "";
};
