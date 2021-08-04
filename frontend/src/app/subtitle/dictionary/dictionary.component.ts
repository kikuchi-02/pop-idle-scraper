import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserDictionary } from 'src/app/typing';
import { DictionaryService, WordInformationParams } from './dictionary.service';

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

  @Output() closeEvent = new EventEmitter<void>();

  private unsubscriber$ = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private dictionaryService: DictionaryService,
    private elementRef: ElementRef
  ) {
    this.dictionaryService
      .getUserDictionary()
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((dictionary) => {
        this.dictionary = dictionary;
        this.cd.markForCheck();
      });
  }

  ngOnInit(): void {}
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

  isKatakana(word: string): boolean {
    const reg = /^[\u{3000}-\u{301C}\u{30A1}-\u{30F6}\u{30FB}-\u{30FE}]+$/mu;
    return reg.test(word);
  }

  add(): void {
    this.dictionary.push({ id: undefined, word: '', pronunciation: '' });
    this.cd.detectChanges();
    const nodes = this.elementRef.nativeElement.querySelectorAll(
      '.dictionary__word'
    );
    const addedElement = nodes[nodes.length - 1];
    addedElement.focus();
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

  close(): void {
    this.dictionaryService.bulkUpdateUserDictionary(this.dictionary);
    this.closeEvent.emit();

    this.save();
  }

  private save(): void {
    const oldUserDictionary = this.dictionaryService.userDictionary;

    const oldDictionaryMap = new Map<number, WordInformationParams>();
    oldUserDictionary.forEach((wordInfo) => {
      oldDictionaryMap.set(wordInfo.id, wordInfo);
    });

    const currentDictionary = this.dictionary;

    const currentDictionaryIds = new Set();
    currentDictionary.map((wordInfo) => {
      if (wordInfo.id) {
        currentDictionaryIds.add(wordInfo.id);
      }
      wordInfo.word = wordInfo.word.trim().toLowerCase();
      wordInfo.pronunciation = wordInfo.pronunciation.trim().toLowerCase();
      return wordInfo;
    });

    const requestData: WordInformationParams[] = currentDictionary
      .filter((wordInfo) => wordInfo.word && wordInfo.pronunciation)
      .map((wordInfo: WordInformationParams) => {
        if (!wordInfo.id) {
          wordInfo.change = 'create';
          return wordInfo;
        }
        const old = oldDictionaryMap.get(wordInfo.id);
        if (
          wordInfo.word !== old.word ||
          wordInfo.pronunciation !== old.pronunciation
        ) {
          wordInfo.change = 'update';
          return wordInfo;
        }
        return wordInfo;
      })
      .filter((word) => word.change);

    oldUserDictionary.forEach((wordInfo) => {
      if (!currentDictionaryIds.has(wordInfo.id)) {
        (wordInfo as WordInformationParams).change = 'delete';
        requestData.push(wordInfo);
      }
    });

    if (requestData.length > 0) {
      this.dictionaryService
        .bulkUpdateUserDictionary(requestData)
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe();
    }
  }
}
