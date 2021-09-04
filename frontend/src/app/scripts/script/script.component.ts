import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import {
  ContentChange,
  QuillEditorComponent,
  SelectionChange,
} from 'ngx-quill';
import { Quill } from 'quill';
import { fromEvent, ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  map,
  mergeMap,
  skip,
  takeUntil,
} from 'rxjs/operators';
import { AppService } from 'src/app/services/app.service';
import { SubtitleComponent } from 'src/app/subtitle/subtitle.component';
import { Script, ScriptRevision } from 'src/app/typing';
import { ScriptService } from './script.service';
import { BalloonComponent } from './text-editor/balloon/balloon.component';
import { EditorService } from './text-editor/editor.service';
import { HistoryComponent } from './text-editor/history/history.component';

@Component({
  selector: 'app-script',
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EditorService],
})
export class ScriptComponent implements OnInit, OnDestroy, AfterViewInit {
  initialScript: Script;
  script: Script;
  blurred = false;
  focused = false;

  showSubtitleLine = { toggle: true, single: true, double: true };
  loading = false;

  darkTheme = false;

  titleFormControl = new FormControl('', [Validators.required]);
  // statusFormControl = new FormControl(ScriptStatus.WIP, [Validators.required]);

  // statusArray = Object.values(ScriptStatus);

  @ViewChild(BalloonComponent)
  balloonComponent: BalloonComponent;
  @ViewChild(QuillEditorComponent) editorComponent: QuillEditorComponent;

  consolePositionTop = 0;

  private initialized$ = new ReplaySubject<void>(1);
  private unsubscriber$ = new Subject<void>();

  private autoSave$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private scriptService: ScriptService,
    private renderer: Renderer2,
    private editorService: EditorService,
    private elementRef: ElementRef,
    private appService: AppService,
    private dialog: MatDialog
  ) {
    this.appService.darkTheme$
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((val) => {
        this.darkTheme = val;
        this.cd.markForCheck();
      });

    this.scriptService.loadingState$
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((state) => {
        this.loading = state;
        this.cd.markForCheck();
      });

    const params = this.route.snapshot.paramMap;
    const id = params.get('id');
    if (id === 'new') {
      this.script = new Script();
      this.initialScript = new Script();
      this.cd.markForCheck();
      this.initialized$.next();
    } else {
      this.scriptService
        .getScript(parseInt(id, 10))
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe((script) => {
          this.script = script;
          this.initialScript = cloneDeep(this.script);
          this.titleFormControl.setValue(this.script.title);
          // this.statusFormControl.setValue(this.script.status);
          this.cd.markForCheck();
          this.initialized$.next();
        });
    }

    this.initialized$
      .pipe(
        mergeMap(() => this.autoSave$),
        debounceTime(1000 * 30),
        takeUntil(this.unsubscriber$)
      )
      .subscribe(() => {
        this.save();
      });
  }

  onEditorCreated(editor: Quill): void {
    this.initialized$
      .pipe(first(), takeUntil(this.unsubscriber$))
      .subscribe(() => {
        const content = editor.getContents();
        content.ops = this.script.deltaOps;
        this.editorService.initialize(this.script.id, editor, content);
      });
  }

  onContentChanged(event: ContentChange): void {
    this.editorService.onContentChanged(event);
    this.autoSave$.next();
  }

  onSelectionChanged(event: SelectionChange): void {
    this.editorService.onSelectionChange(event);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  ngAfterViewInit(): void {
    this.initialized$
      .pipe(first(), takeUntil(this.unsubscriber$))
      .subscribe(async () => {
        this.cd.detectChanges();

        this.registerEditorEventListener();

        this.consolePositionTop = document
          .querySelector('.tool-box__wrapper')
          .getBoundingClientRect().height;
      });

    fromEvent(window, 'resize')
      .pipe(
        map(
          () =>
            this.editorComponent.elementRef.nativeElement.getBoundingClientRect()
              .width
        ),
        distinctUntilChanged(),
        debounceTime(300),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((width) => {
        if (width > 900) {
          this.showSubtitleLine.single = true;
          this.showSubtitleLine.double = true;
        } else if (width > 500) {
          this.showSubtitleLine.single = true;
          this.showSubtitleLine.double = false;
        } else {
          this.showSubtitleLine.single = false;
          this.showSubtitleLine.double = false;
        }

        this.cd.markForCheck();
      });
  }

  canDeactivate(): boolean {
    this.script.deltaOps = this.editorService.getDelta();
    if (this.script.isEqual(this.initialScript)) {
      return true;
    }
    return window.confirm(
      'Are you sure you want to leave this page before you save this script'
    );
  }

  save(): void {
    this.script.title = this.titleFormControl.value;
    // this.script.status = this.statusFormControl.value;
    this.script.deltaOps = this.editorService.getDelta();
    if (this.script.deltaOps.length === 0 || !this.script.title) {
      return;
    }
    if (this.script.isEqual(this.initialScript)) {
      return;
    }

    if (this.script.id) {
      this.scriptService
        .putScript(this.script)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe((script) => {
          this.script = script;
          this.initialScript = cloneDeep(script);
          this.cd.markForCheck();
        });
    } else {
      this.scriptService
        .postScript(this.script)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe((script) => {
          this.script = script;
          this.initialScript = cloneDeep(script);
          this.cd.markForCheck();

          this.router.navigate([`../${script.id}`], { relativeTo: this.route });
        });
    }
  }

  copy2Clipboard(): void {
    const div = this.renderer.createElement('div');
    div.innerHTML = this.script.deltaOps.map((delta) => delta.insert).join('');

    const elm = document.createElement('textarea');
    elm.value = this.editorService.getText();
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
    window.scroll({ top: 0, behavior: 'smooth' });

    const scrolbar = this.editorComponent.elementRef.nativeElement.querySelector(
      '.ql-editor'
    );
    scrolbar.scrollTop = { top: 0, behavior: 'smooth' };
  }

  navigateSubtitle(): void {
    const div = this.renderer.createElement('div');
    div.innerHTML = this.script.deltaOps.map((delta) => delta.insert).join('');

    const textContent = this.editorService.getText();

    const subtitleKey = SubtitleComponent.subtitleLocalStorageKey;
    localStorage.setItem(subtitleKey, textContent);
    this.router.navigate(['/subtitle']);
  }

  undo(): void {
    this.editorService.undo();
  }
  redo(): void {
    this.editorService.redo();
  }

  openHistoryDialog(): void {
    const dialogRef = this.dialog.open(HistoryComponent, {
      data: {
        script: this.script,
        darkTheme: this.darkTheme,
      },
      height: '80vh',
      width: '80vh',
    });

    dialogRef.afterClosed().subscribe((revision: ScriptRevision) => {
      if (revision) {
        this.editorService.setDelta(revision.deltaOps);
      }
    });
  }

  private registerEditorEventListener(): void {
    fromEvent(this.editorComponent.elementRef.nativeElement, 'mouseup')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((event: MouseEvent) => {
        this.balloonComponent.selectionChange(event);

        const commentedElement = (event.target as any).closest(
          '[data-comment-uuid]'
        );
        if (commentedElement) {
          const uuid = commentedElement.getAttribute('data-comment-uuid');
          this.editorService.focusChatMessage(uuid);
        }
      });

    fromEvent(this.editorComponent.elementRef.nativeElement, 'keydown')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((event: KeyboardEvent) => {
        if (event.ctrlKey) {
          switch (event.key) {
            case 'z':
              if (event.shiftKey) {
                this.editorService.undo();
              } else {
                this.editorService.redo();
              }
              event.preventDefault();
              break;
            case 's':
              this.autoSave$.next();
              this.save();
              event.preventDefault();
          }
        }
      });

    this.editorService.editorFocus$
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(({ uuid, type }) => {
        let targetElm: HTMLElement;
        switch (type) {
          case 'textlint':
            targetElm = this.elementRef.nativeElement.querySelector(
              `[data-lint-uuid="${uuid}"]`
            );
            break;
          case 'comment':
            targetElm = this.elementRef.nativeElement.querySelector(
              `[data-comment-uuid="${uuid}"]`
            );
            break;
        }

        if (!targetElm) {
          return;
        }
        this.renderer.addClass(targetElm, 'focused');
        const rect = targetElm.getBoundingClientRect();
        const offset = 300;
        const y = rect.y + window.scrollY - offset;
        window.scroll({
          top: y < offset ? 0 : y,
          behavior: 'smooth',
        });

        fromEvent(document, 'click')
          .pipe(
            skip(1),
            filter((event) => {
              const clickedElement = event.target as HTMLElement;
              return !targetElm.contains(clickedElement);
            }),
            first(),
            takeUntil(this.unsubscriber$)
          )
          .subscribe((event) => {
            this.renderer.removeClass(targetElm, 'focused');
          });
      });
  }

  // @HostListener('paste', ['$event'])
  // preventFormattedPast(event: ClipboardEvent): void {
  //   event.preventDefault();
  //   const { clipboardData } = event;
  //   const text =
  //     clipboardData.getData('text/plain') || clipboardData.getData('text');
  //   // const html = clipboardData.getData('html');
  //   // const delta = this.editor.quillEditor.clipboard.convert(html);
  //   this.editor.quillEditor.clipboard.dangerouslyPasteHTML(text);
  //   // debugger;
  //   // document.execCommand('insertText', false, text);
  // }
}
