import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loginInvalid = false;

  private unsubscriber$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  onSubmit(): void {
    if (!this.form.valid) {
    }
    const email = this.form.get('email').value;
    const password = this.form.get('password').value;
    this.authenticationService
      .login(email, password)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe({
        next: () => {},
        error: (err) => {
          this.loginInvalid = true;
          this.cd.markForCheck();
        },
      });
  }
}
