import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Quill from 'quill';
import { Script, ScriptRevision } from 'src/app/typing';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  script: Script;
  darkTheme: boolean;
  selectedRevision: ScriptRevision;

  private editor: Quill;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<HistoryComponent>
  ) {
    this.script = data.script;
    this.darkTheme = data.darkTheme;
  }

  ngOnInit(): void {}

  onEditorCreated(event: Quill): void {
    this.editor = event;
    const lastRevision = this.script.revisions[
      this.script.revisions.length - 1
    ];
    this.showHistory(lastRevision);
  }

  showHistory(revision: ScriptRevision): void {
    this.selectedRevision = revision;
    const contents = this.editor.getContents();
    contents.ops = revision.deltaOps;
    this.editor.setContents(contents);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
