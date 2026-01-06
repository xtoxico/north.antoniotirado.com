import { Injectable, signal, computed } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthFacade {
    // State
    private _token = signal<string | null>(localStorage.getItem('token'));
    
    // Selectors
    isAuthenticated = computed(() => !!this._token());
    token = computed(() => this._token());

    // Actions
    setToken(token: string): void {
        localStorage.setItem('token', token);
        this._token.set(token);
    }

    logout(): void {
        localStorage.removeItem('token');
        this._token.set(null);
        window.location.href = '/login';
    }

    // Helper to decode token if we need user info later (e.g. jwt-decode)
    // For now we trust the token presence
}
