import { OverlayContainer } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  toggleControl = new FormControl(false);

  private themeKey = 'theme-key';

  constructor(
    private titleService: Title,
    private appService: AppService,
    private overlayContainer: OverlayContainer,
    private renderer: Renderer2
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
  }
}
