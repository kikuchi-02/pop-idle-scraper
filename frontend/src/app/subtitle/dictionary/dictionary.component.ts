import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { catchError, first, takeUntil } from 'rxjs/operators';
import { UserDictionary } from 'src/app/typing';
import { DictionaryService } from './dictionary.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryComponent implements OnInit, OnDestroy, AfterViewInit {
  dictionary: UserDictionary;
  text = '';

  @ViewChild('form') fromElement: ElementRef;
  @ViewChild('searchInput') searchInputElement: ElementRef;

  @Input() newDictionaryKeys: string[];

  private unsubscriber$ = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private dictionaryService: DictionaryService,
    private elementRef: ElementRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.dictionaryService
      .getUserDictionary()
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((dictionary) => {
        this.dictionary = dictionary;
        this.add(this.newDictionaryKeys);
        this.cd.markForCheck();
      });
  }
  ngOnDestroy(): void {
    this.dictionaryService
      .bulkUpdateUserDictionary(this.dictionary)
      .pipe(
        catchError(() => undefined),
        takeUntil(this.unsubscriber$)
      )
      .subscribe(() => {
        this.unsubscriber$.next();
      });
  }

  ngAfterViewInit(): void {
    // fromEvent(this.searchInputElement.nativeElement, 'keydown')
    //   .pipe(takeUntil(this.unsubscriber$))
    //   .subscribe((event: KeyboardEvent) => {
    //     switch (event.key) {
    //       case 'Enter':
    //         this.filter();
    //         event.preventDefault();
    //     }
    //   });
  }

  isKatakana(word: string): boolean {
    const reg = /^[\u{3000}-\u{301C}\u{30A1}-\u{30F6}\u{30FB}-\u{30FE}]+$/mu;
    return reg.test(word);
  }

  add(words?: string[]): void {
    if (words) {
      this.dictionary.push(
        ...words.map((word) => ({
          id: undefined,
          word,
          pronunciation: '',
        }))
      );
    } else {
      this.dictionary.push({
        id: undefined,
        word: '',
        pronunciation: '',
      });
    }
    this.cd.markForCheck();
    this.ngZone.onStable
      .pipe(first(), takeUntil(this.unsubscriber$))
      .subscribe(() => {
        const nodes = this.elementRef.nativeElement.querySelectorAll(
          '.dictionary__word'
        );
        const addedElement = nodes[nodes.length - 1];
        addedElement.focus();
      });
  }

  // sort(by: 'word' | 'pronunciation'): void {
  //   if (by === 'word') {
  //     this.dictionary = this.dictionary.sort((a, b) =>
  //       a.word < b.word ? 0 : 1
  //     );
  //   } else if (by === 'pronunciation') {
  //     this.dictionary = this.dictionary.sort((a, b) =>
  //       a.pronunciation < b.pronunciation ? 0 : 1
  //     );
  //   }
  //   this.cd.markForCheck();
  // }
}
