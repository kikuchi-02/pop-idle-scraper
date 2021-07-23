import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  OnInit,
} from '@angular/core';
import { EditorService } from '../editor.service';

@Component({
  selector: 'app-balloon',
  templateUrl: './balloon.component.html',
  styleUrls: ['./balloon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalloonComponent implements OnInit {
  @HostBinding('style.top') top: string;
  @HostBinding('style.left') left: string;
  @HostBinding('style.display') display = 'none';

  private selection: Selection;

  constructor(
    private cd: ChangeDetectorRef,
    private editorService: EditorService
  ) {}

  ngOnInit(): void {}

  selectionChange(event: MouseEvent): void {
    this.selection = window.getSelection();
    const range = this.selection.getRangeAt(0);
    if (this.selection.isCollapsed) {
      this.display = 'none';
      this.cd.markForCheck();
      return;
    }

    const rect = range.getBoundingClientRect();
    const offset = 30;
    this.top = rect.top + window.pageYOffset - offset + 'px';
    this.left = rect.left + 'px';
    this.display = 'block';
    this.cd.markForCheck();
  }

  @HostListener('document:click', ['$event'])
  clickDocument(event): void {
    if (!event.target.closest('.editor__main')) {
      this.display = 'none';
      this.cd.markForCheck();
    }
  }

  colorUp(): void {
    this.editorService.selectionColorUp();
  }

  backColor(): void {
    this.editorService.selectionBackgroundColorUp();
  }

  format(): void {
    this.editorService.selectionReformat();
  }

  strike(): void {
    this.editorService.selectionStrike();
  }
}
