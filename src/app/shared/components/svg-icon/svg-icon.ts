import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  template: ` <span class="svg-icon" [style.--icon-url]="iconUrl()"></span> `,

  styles: [
    `
      .svg-icon {
        width: 1.25rem;
        height: 1.25rem;
        display: inline-block;
        flex-shrink: 0;
        background-color: currentColor;
        mask: var(--icon-url) center / contain no-repeat;
        -webkit-mask: var(--icon-url) center / contain no-repeat;
      }
    `,
  ],
})
export class SvgIcon {
  readonly name = input.required<string>();

  readonly iconUrl = computed(() => {
    return `url('/public/icons/${this.name()}.svg')`;
  });
}
