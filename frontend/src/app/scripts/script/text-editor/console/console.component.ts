import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScriptService, TextLintMessages } from '../../script.service';
import { EditorService } from '../editor.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleComponent implements OnInit, OnDestroy {
  private unsubscriber$ = new Subject<void>();

  textLintErrors: string[];
  textLintRaisedError = false;

  constructor(
    private scriptService: ScriptService,
    private cd: ChangeDetectorRef,
    private editorService: EditorService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  textLint(): void {
    const text = this.editorService.getText();
    if (!text) {
      return;
    }
    this.scriptService.loadingStateChange(true);
    this.scriptService
      .textLint(text)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(
        (result) => {
          const formatted = this.formatTextLintResult(result);
          this.textLintErrors = formatted;
          this.cd.markForCheck();
          this.scriptService.loadingStateChange(false);
        },
        (err) => {
          this.textLintRaisedError = true;
          this.textLintErrors = undefined;
          this.cd.markForCheck();
          this.scriptService.loadingStateChange(false);
        }
      );
  }

  private formatTextLintResult(result: TextLintMessages): string[] {
    return result[0].messages.map((msg) => `${msg.line} - ${msg.message}`);
  }
}
