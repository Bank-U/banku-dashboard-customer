import { Component, AfterViewInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoaderComponent implements AfterViewInit {
  @ViewChild('loaderSvg') loaderSvg!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      const svgElements = this.loaderSvg.nativeElement.querySelectorAll('*');
      svgElements.forEach((el: SVGGeometryElement) => {
        if (el.getTotalLength) {
          const len = el.getTotalLength();
          el.style.setProperty('--len', len.toString());
        }
      });
    });
  }
} 