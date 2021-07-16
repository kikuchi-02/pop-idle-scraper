import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Script } from 'src/app/typing';
import { ScriptListService } from './script-list.service';

@Component({
  selector: 'app-script-list',
  templateUrl: './script-list.component.html',
  styleUrls: ['./script-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScriptListComponent implements OnInit, OnDestroy {
  scripts: Script[];

  deleteScriptIds: number[] = [];

  private unsubscriber$ = new Subject<void>();

  constructor(
    private scriptListService: ScriptListService,
    private cd: ChangeDetectorRef
  ) {
    this.scriptListService
      .getScripts(1)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((scripts) => {
        this.scripts = scripts;
        this.cd.markForCheck();
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  checkScript(event, scriptId: number): void {
    if (event.target.checked) {
      this.deleteScriptIds.push(scriptId);
    } else {
      this.deleteScriptIds = this.deleteScriptIds.filter(
        (id) => id !== scriptId
      );
    }
  }

  deleteScripts(): void {
    this.scriptListService
      .deleteScripts(this.deleteScriptIds)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(() => {
        this.scripts = this.scripts.filter(
          (script) => !this.deleteScriptIds.includes(script.id)
        );
        this.deleteScriptIds = [];
        this.cd.markForCheck();
      });
  }
}
