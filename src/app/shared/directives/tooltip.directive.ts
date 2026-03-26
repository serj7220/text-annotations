import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipText = '';
  private tooltipElement: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipText) return;

    this.tooltipElement = this.renderer.createElement('div');
    const textNode = this.renderer.createText(this.tooltipText);
    this.renderer.appendChild(this.tooltipElement, textNode);

    this.renderer.addClass(this.tooltipElement, 'custom-tooltip');

    this.renderer.appendChild(document.body, this.tooltipElement);

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(
      this.tooltipElement,
      'top',
      `${hostPos.top + window.scrollY - 35}px`,
    );
    this.renderer.setStyle(
      this.tooltipElement,
      'left',
      `${hostPos.left + window.scrollX}px`,
    );
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.destroyTooltip();
  }

  ngOnDestroy() {
    this.destroyTooltip();
  }

  private destroyTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
