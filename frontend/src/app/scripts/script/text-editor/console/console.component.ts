import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScriptService, TextLintMessages } from '../../script.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleComponent implements OnInit, OnDestroy {
  private unsubscriber$ = new Subject<void>();

  textLintErrors: string[];

  constructor(
    private scriptService: ScriptService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef
  ) {
    this.scriptService.lintResult$
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((result) => {
        const formatted = this.formatTextLintResult(result);
        this.textLintErrors = formatted;
        this.cd.markForCheck();
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  collapse(elm: HTMLElement): void {
    if (elm.style.display === 'none') {
      this.renderer.setStyle(elm, 'display', 'block');
    } else {
      this.renderer.setStyle(elm, 'display', 'none');
    }
    this.cd.markForCheck();
  }

  private formatTextLintResult(result: TextLintMessages): string[] {
    return result[0].messages.map((msg) => `${msg.line} - ${msg.message}`);
  }
}
