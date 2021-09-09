import { OverlayContainer } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  toggleControl = new FormControl(false);

  loading = false;

  private themeKey = 'theme-key';
  private unsubscriber$ = new Subject();

  constructor(
    private titleService: Title,
    private appService: AppService,
    private overlayContainer: OverlayContainer,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef
  ) {
    this.titleService.setTitle('アイドル情報まとめ');
  }

  ngOnInit(): void {
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const className = 'dark-theme';
      const body = document.querySelector('body');
      if (darkMode) {
        this.overlayContainer.getContainerElement().classList.add(className);
        this.renderer.addClass(body, className);
      } else {
        this.overlayContainer.getContainerElement().classList.remove(className);
        this.renderer.removeClass(body, className);
      }
      localStorage.setItem(this.themeKey, JSON.stringify(darkMode));
      this.appService.setTheme(darkMode);
    });

    const theme = localStorage.getItem(this.themeKey);
    this.toggleControl.setValue(JSON.parse(theme));

    this.appService.loading$
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((v) => {
        this.loading = v;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }
}
