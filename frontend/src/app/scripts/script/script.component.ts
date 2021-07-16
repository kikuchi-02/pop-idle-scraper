import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Script } from 'src/app/typing';
import { ScriptService } from './script.service';
import { BalloonComponent } from './text-editor/balloon/balloon.component';
import { EditableDirective } from './text-editor/editable.directive';

@Component({
  selector: 'app-script',
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScriptComponent implements OnInit, OnDestroy, AfterViewInit {
  initialScript: Script;
  script = new Script();
  blurred = false;
  focused = false;

  showSubtitleLine = true;
  loading = false;

  titleFormControl = new FormControl('', [Validators.required]);

  @ViewChild(EditableDirective)
  editableDirective: EditableDirective;
  @ViewChild(BalloonComponent)
  balloonComponent: BalloonComponent;

  consolePositionTop = 0;

  private unsubscriber$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private scriptService: ScriptService,
    private renderer: Renderer2
  ) {
    const params = this.route.snapshot.paramMap;
    const id = params.get('id');
    if (id === 'new') {
      this.initialScript = new Script();
      this.cd.markForCheck();
    } else {
      this.scriptService
        .getScript(parseInt(id, 10))
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe((script) => {
          this.script = script;
          this.initialScript = this.script.clone();
          this.titleFormControl.setValue(this.script.title);
          this.cd.markForCheck();
        });
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  ngAfterViewInit(): void {
    this.renderer.listen(
      this.editableDirective.elementRef.nativeElement,
      'mouseup',
      (event) => this.balloonComponent.selectionChange(event)
    );

    this.consolePositionTop = document
      .querySelector('.tool-box__wrapper')
      .getBoundingClientRect().height;
  }

  canDeactivate(): boolean {
    if (this.script.isEqual(this.initialScript)) {
      return true;
    }
    return window.confirm(
      'Are you sure you want to leave this page before you save this script'
    );
  }

  setTextContent(text: string): void {
    this.editableDirective.clearContent();
    this.editableDirective.insertTextContent(text);
  }

  save(): void {
    this.script.title = this.titleFormControl.value;
    if (!this.script.innerHtml || !this.script.title) {
      return;
    }

    if (this.script.id) {
      this.scriptService
        .putScript(this.script)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe((script) => {
          this.script = script;
          this.initialScript = script;
          this.cd.markForCheck();
        });
    } else {
      this.scriptService
        .postScript(this.script)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe((script) => {
          this.script = script;
          this.initialScript = script;

          this.cd.markForCheck();
          this.router.navigate([`../${script.id}`], { relativeTo: this.route });
        });
    }
  }

  copy2Clipboard(): void {
    const div = this.renderer.createElement('div');
    div.innerHTML = this.script.innerHtml;

    const textContent = [...div.childNodes]
      .map((node) => node.textContent)
      .join('\n');

    const elm = document.createElement('textarea');
    elm.value = textContent;
    document.body.appendChild(elm);
    elm.select();
    elm.setSelectionRange(0, 9999);
    document.execCommand('copy');
    document.body.removeChild(elm);
  }

  deleteScript(): void {
    if (window.confirm('Are you sure you want to delete')) {
      this.scriptService
        .deleteScript(this.script.id)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe(() => {
          this.router.navigate(['../'], { relativeTo: this.route });
        });
    }
  }

  scrollTop(): void {
    window.scrollTo(0, 0);
  }
}
