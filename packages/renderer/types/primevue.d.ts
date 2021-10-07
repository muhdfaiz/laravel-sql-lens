interface OverlayPanelProps {
  dismissable?: boolean;
  showCloseIcon?: boolean;
  appendTo?: string;
  baseZIndex?: number;
  autoZIndex?: boolean;
  ariaCloseLabel?: string;
  breakpoints?: { [key: string]: string };
}

export interface OverlayComponent {
  $props: OverlayPanelProps;
  toggle(event: Event): void;
  show(event: Event, target?): void;
  hide(): void;
  $emit(eventName: "show"): this;
  $emit(eventName: "hide"): this;
  $slots: {
    "": VNode[];
  };
}
