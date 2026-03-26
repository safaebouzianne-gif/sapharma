import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // If already logged in, redirect to dashboard
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    // Simulate login for dev purposes since backend might not be ready, but we will call the auth service.
    // If you don't have a backend yet, uncomment the mock below:
    /*
    setTimeout(() => {
      const mockUser = { id: 1, username: this.f['username'].value, role: 'ADMIN' as any };
      localStorage.setItem('sio_user', JSON.stringify(mockUser));
      this.authService['currentUserSubject'].next(mockUser);
      this.router.navigate(['/dashboard']);
    }, 1000);
    return;
    */

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Identifiants incorrects ou serveur indisponible.';
        this.loading = false;

        // Developer mock fallback if real backend fails:
        // alert('Backend non disponible, connexion simulée (Admin).');
        // const mockUser = { id: 1, username: this.f['username'].value, role: 'ADMIN' as any };
        // localStorage.setItem('sio_user', JSON.stringify(mockUser));
        // this.authService['currentUserSubject'].next(mockUser);
        // this.router.navigate(['/dashboard']);
      }
    });
  }
}
