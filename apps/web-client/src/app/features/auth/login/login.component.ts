import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="card">
        <h1>Welcome to North</h1>
        <p>Sign in to track your habits and goals.</p>
        <a href="/api/auth/google" class="btn-google">
          Sign in with Google
        </a>
      </div>
    </div>
  `,
  styles: [`
    .login-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5; }
    .card { background: white; padding: 3rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
    h1 { margin-bottom: 0.5rem; }
    p { color: #666; margin-bottom: 2rem; }
    .btn-google {
      display: inline-block;
      background: #4285f4;
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.2s;
    }
    .btn-google:hover { background: #357ae8; }
  `]
})
export class LoginComponent {}
