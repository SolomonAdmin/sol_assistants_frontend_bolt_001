export interface Logo {
  src: string;
  alt: string;
}

export interface HeroPanelProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  logos?: Logo[];
  showVideoButton?: boolean;
  onWatchDemo?: () => void;
}