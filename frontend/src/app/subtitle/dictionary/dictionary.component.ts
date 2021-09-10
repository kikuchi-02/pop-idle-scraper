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
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { AppService } from 'src/app/services/app.service';
import { UserDictionary, WordDetail } from 'src/app/typing';
import { DictionaryService } from './dictionary.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryComponent implements OnInit, OnDestroy, AfterViewInit {
  dictionary: UserDictionary;
  textForm = new FormControl('');

  count: number;
  pageSize: number;
  pageIndex: number;
  pageSizeOptions = [10, 30, 60];

  darkTheme = false;

  @ViewChild('form') fromElement: ElementRef;
  @ViewChild('searchInput') searchInputElement: ElementRef;

  @Input() newDictionaryKeys: string[];
  newDictionary: UserDictionary = [
    {
      id: undefined,
      word: '',
      pronunciation: '',
    },
  ];
  private updateWords = new Map<number, WordDetail>();
  private deleteWordIds = new Set<number>();

  private unsubscriber$ = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private dictionaryService: DictionaryService,
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private appService: AppService
  ) {
    this.appService.darkTheme$
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((val) => {
        this.darkTheme = val;
        this.cd.markForCheck();
      });
  }

  ngOnInit(): void {
    this.paginate(0, 10);
  }
  ngOnDestroy(): void {
    this.unsubscriber$.next();
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

  add(words?: string[]): void {
    if (words && words.length > 0) {
      this.newDictionary.push(
        ...words.map((word) => ({
          id: undefined,
          word,
          pronunciation: '',
        }))
      );
    } else {
      this.newDictionary.push({
        id: undefined,
        word: '',
        pronunciation: '',
      });
    }
    this.cd.markForCheck();

    this.ngZone.onStable
      .pipe(first(), takeUntil(this.unsubscriber$))
      .subscribe(() => {
        const newDictionaryTable = this.elementRef.nativeElement.querySelector(
          '.inner__new'
        );
        const nodes = newDictionaryTable.querySelectorAll('.dictionary__word');
        const addedElement = nodes[nodes.length - 1];
        addedElement.focus();
      });
  }

  search(): void {
    if (this.textForm.valid) {
      this.paginate(0, this.pageSize, this.textForm.value);
    }
  }

  onInput(row: WordDetail, event, type: 'word' | 'pronunciation'): void {
    const text = event.target.textContent;
    if (type === 'word') {
      row.word = text;
    } else if (type === 'pronunciation') {
      row.pronunciation = text;
    }
    this.checkIsKatakana(row);
    if (!row.error && row.id) {
      this.updateWords.set(row.id, row);
    }
    this.cd.markForCheck();
  }

  private checkIsKatakana(row: WordDetail): void {
    if (this.isKatakana(row.pronunciation)) {
      delete row.error;
    } else {
      row.error = 'should be katakana';
    }
  }

  isKatakana(word: string): boolean {
    const reg = /^[\u{3000}-\u{301C}\u{30A1}-\u{30F6}\u{30FB}-\u{30FE}|']+$/mu;
    return reg.test(word);
  }

  deleteWord(word: WordDetail, index: number): void {
    if (word.id === undefined) {
      this.newDictionary.splice(index, 1);
    } else {
      this.dictionary = this.dictionary.filter((dic) => dic.id !== word.id);
      this.deleteWordIds.add(word.id);
    }
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

  save(): void {
    this.newDictionary = this.newDictionary.filter(
      (wordInfo) =>
        wordInfo.word !== '' &&
        wordInfo.pronunciation !== '' &&
        this.isKatakana(wordInfo.pronunciation)
    );

    const newWords = this.newDictionary.filter(
      (word) => word.word !== '' && word.pronunciation !== '' && !word.error
    );
    const updateWords = Array.from(this.updateWords.values()).filter(
      (word) => !this.deleteWordIds.has(word.id)
    );
    const deleteIds = Array.from(this.deleteWordIds);

    if (
      newWords.length === 0 &&
      updateWords.length === 0 &&
      deleteIds.length === 0
    ) {
      this.newDictionary = [
        {
          id: undefined,
          word: '',
          pronunciation: '',
        },
      ];
      this.cd.markForCheck();
      return;
    }

    this.dictionaryService
      .bulkUpdateUserDictionary(newWords, updateWords, deleteIds)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(() => {
        this.paginate(this.pageIndex, this.pageSize, this.textForm.value);
        this.newDictionary = [
          {
            id: undefined,
            word: '',
            pronunciation: '',
          },
        ];
        this.cd.markForCheck();
      });
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.paginate(pageEvent.pageIndex, pageEvent.pageSize);
  }

  private paginate(pageIndex: number, pageSize: number, search?: string): void {
    this.dictionaryService
      .getUserDictionary(pageIndex, pageSize, search)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((response) => {
        this.dictionary = response.data
          .filter((wordInfo) => !this.deleteWordIds.has(wordInfo.id))
          .map((wordInfo) => {
            this.checkIsKatakana(wordInfo);
            if (this.updateWords.has(wordInfo.id)) {
              return this.updateWords.get(wordInfo.id);
            }
            return wordInfo;
          });

        this.count = response.count;
        this.pageSize = response.pageSize;
        this.pageIndex = response.pageIndex;
        this.cd.detectChanges();
      });
  }
}
