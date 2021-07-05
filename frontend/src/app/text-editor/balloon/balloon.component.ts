import { Color } from '@angular-material-components/color-picker';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TextEditorService } from '../text-editor.service';

@Component({
  selector: 'app-balloon',
  templateUrl: './balloon.component.html',
  styleUrls: ['./balloon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalloonComponent implements OnInit, OnDestroy {
  @HostBinding('style.top') top: string;
  @HostBinding('style.left') left: string;
  @HostBinding('style.display') display = 'none';

  colorCtr = new FormControl();
  color: ThemePalette = 'primary';
  backColorCode: string;

  private selection: Selection;
  private unsubscriber$ = new Subject<void>();
  private backColorHexKey = 'back-color-code-key';

  constructor(
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private textEditorService: TextEditorService
  ) {
    const colorHex = localStorage.getItem(this.backColorHexKey);
    this.backColorCode = colorHex ? `#${colorHex}` : `#000000`;
    const colorGba = this.hex2rgb(this.backColorCode);
    this.colorCtr.setValue(new Color(colorGba[0], colorGba[1], colorGba[2]));

    this.colorCtr.valueChanges
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((value) => {
        this.backColorCode = `#${value.toHex()}`;
        localStorage.setItem(this.backColorHexKey, this.backColorCode);
        this.cd.markForCheck();
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

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
  clickDocument(event) {
    if (!event.target.closest('.editor__main')) {
      this.display = 'none';
      this.cd.markForCheck();
    }
  }

  backColor(): void {
    document.execCommand('backColor', false, this.backColorCode);
    this.cd.markForCheck();
  }

  format(): void {
    const range = this.selection.getRangeAt(0);
    const newRange = document.createRange();

    newRange.setStart(range.startContainer, 0);
    if (range.endContainer.nodeValue) {
      newRange.setEnd(range.endContainer, range.endContainer.nodeValue.length);
    } else {
      newRange.setEnd(
        range.startContainer,
        range.startContainer.nodeValue.length
      );
    }
    this.selection.removeAllRanges();
    this.selection.addRange(newRange);

    let formatted = this.textEditorService.splitTextByNewline(
      this.selection.toString()
    );
    formatted = formatted.replace(/(?<!\n)\n{2}(?!\n)/g, '\n');
    document.execCommand('insertText', false, formatted);
    this.cd.markForCheck();
  }

  strike(): void {
    document.execCommand('strikethrough', false);
    this.cd.markForCheck();
  }

  private hex2rgb(hex: string) {
    if (hex.slice(0, 1) === '#') {
      hex = hex.slice(1);
    }
    if (hex.length === 3) {
      hex =
        hex.slice(0, 1) +
        hex.slice(0, 1) +
        hex.slice(1, 2) +
        hex.slice(1, 2) +
        hex.slice(2, 3) +
        hex.slice(2, 3);
    }

    return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((str) =>
      parseInt(str, 16)
    );
  }
}
