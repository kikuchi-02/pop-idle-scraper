import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as marked from 'marked';
import { Renderer as MarkedRenderer } from 'marked';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent implements OnInit {
  @Input()
  set rawMarkdown(text: string) {
    this.markdownToHtml(text);
  }

  result: string;

  constructor(private sanitizer: DomSanitizer, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  private markdownToHtml(text: string) {
    const compiled = marked.parse(text, {
      renderer: new MarkedRenderer(),
    });
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, compiled);
    this.result = sanitized;
    this.cd.markForCheck();
  }
}
