import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IdleSwitchState, Post } from '../typing';
import { NewsService } from './news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit, OnDestroy {
  posts: Post[];

  idleSwitchState: IdleSwitchState = {
    nogizakaCheck: true,
    sakurazakaCheck: true,
    hinatazakaCheck: true,
  };

  private nogizakaKoshiki: Post[];
  private sakurazakaKoshiki: Post[];
  private hinatazakaKoshiki: Post[];

  private nogizakaBlog: Post[];
  private sakurazakaBlog: Post[];
  private hinatazakaBlog: Post[];

  private nogizakaTwitter: Post[];
  private sakurazakaTwitter: Post[];
  private hinatazakaTwitter: Post[];

  private unsubscriber$ = new Subject<void>();

  constructor(private newsService: NewsService, private cd: ChangeDetectorRef) {
    forkJoin([
      this.newsService.getSite('nogizaka-koshiki'),
      this.newsService.getSite('nogizaka-blog'),
      this.newsService.getTweets('nogizaka'),
      this.newsService.getSite('sakurazaka-koshiki'),
      this.newsService.getSite('sakurazaka-blog'),
      this.newsService.getTweets('sakurazaka'),
      this.newsService.getSite('hinatazaka-koshiki'),
      this.newsService.getSite('hinatazaka-blog'),
      this.newsService.getTweets('hinatazaka'),
    ])
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe({
        next: ([
          nogizakaKoshiki,
          nogizakaBlog,
          nogizakaTweet,
          sakurazakaKoshiki,
          sakurazakaBlog,
          sakurazakaTweet,
          hinatazakaKoshiki,
          hinatazakaBlog,
          hinatazakaTweet,
        ]) => {
          this.nogizakaKoshiki = nogizakaKoshiki.posts;
          this.nogizakaBlog = nogizakaBlog.posts;
          this.nogizakaTwitter = nogizakaTweet.posts.map((tweet) => {
            tweet.isTweet = true;
            return tweet;
          });
          this.sakurazakaKoshiki = sakurazakaKoshiki.posts;
          this.sakurazakaBlog = sakurazakaBlog.posts;
          this.sakurazakaTwitter = sakurazakaTweet.posts.map((tweet) => {
            tweet.isTweet = true;
            return tweet;
          });
          this.hinatazakaKoshiki = hinatazakaKoshiki.posts;
          this.hinatazakaBlog = hinatazakaBlog.posts;
          this.hinatazakaTwitter = hinatazakaTweet.posts.map((tweet) => {
            tweet.isTweet = true;
            return tweet;
          });

          this.switchIdle();
        },
        error: console.error,
      });
  }

  switchIdle(): void {
    const posts: Post[] = [];
    if (this.idleSwitchState.nogizakaCheck) {
      posts.push(
        ...this.nogizakaKoshiki,
        ...this.nogizakaBlog,
        ...this.nogizakaTwitter
      );
    }
    if (this.idleSwitchState.sakurazakaCheck) {
      posts.push(
        ...this.sakurazakaKoshiki,
        ...this.sakurazakaBlog,
        ...this.sakurazakaTwitter
      );
    }
    if (this.idleSwitchState.hinatazakaCheck) {
      posts.push(
        ...this.hinatazakaKoshiki,
        ...this.hinatazakaBlog,
        ...this.hinatazakaTwitter
      );
    }
    posts.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
    this.posts = posts;
    this.cd.markForCheck();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }
}
