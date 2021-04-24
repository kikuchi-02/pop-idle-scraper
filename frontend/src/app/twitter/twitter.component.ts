import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IdleKind, Post } from '../typing';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwitterComponent implements OnInit, OnDestroy {
  @Input() idle: IdleKind;

  tweets: Post[];
  siteTitle: string;

  private unsubscriber$: Subject<void> = new Subject<void>();
  constructor(
    private utilService: UtilService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.utilService
      .getTweets(this.idle)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((val) => {
        this.tweets = val?.posts;
        this.siteTitle = val?.siteTitle;
        this.cd.markForCheck();
      });
  }
  ngOnDestroy() {
    this.unsubscriber$.next();
  }
}
