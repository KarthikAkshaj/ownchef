// src/lib/stores/toast.ts - Toast Store and Manager
import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';

// ========================================
// TYPES AND INTERFACES
// ========================================

export interface ToastData {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
    persistent?: boolean;
    showIcon?: boolean;
    showClose?: boolean;
    action?: ToastAction;
    createdAt: Date;
}

export interface ToastAction {
    label: string;
    handler: () => void;
    style?: 'primary' | 'secondary';
}

export interface ToastOptions {
    type?: ToastData['type'];
    title?: string;
    duration?: number;
    persistent?: boolean;
    showIcon?: boolean;
    showClose?: boolean;
    action?: ToastAction;
}

// ========================================
// STORE IMPLEMENTATION
// ========================================

class ToastStore {
    private toasts: Writable<ToastData[]> = writable([]);
    private counter = 0;

    // Public readable store
    public readonly store: Readable<ToastData[]> = derived(
        this.toasts,
        ($toasts) => $toasts
    );

    // Subscribe method for convenience
    public subscribe = this.store.subscribe;

    /**
     * Add a new toast notification
     */
    public add(message: string, options: ToastOptions = {}): string {
        const id = this.generateId();
        const toast: ToastData = {
            id,
            type: options.type || 'info',
            title: options.title,
            message,
            duration: options.duration ?? 5000,
            persistent: options.persistent ?? false,
            showIcon: options.showIcon ?? true,
            showClose: options.showClose ?? true,
            action: options.action,
            createdAt: new Date()
        };

        this.toasts.update(toasts => [...toasts, toast]);

        // Auto-remove toast if not persistent
        if (!toast.persistent && toast.duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, toast.duration);
        }

        return id;
    }

    /**
     * Remove a specific toast by ID
     */
    public remove(id: string): void {
        this.toasts.update(toasts => toasts.filter(t => t.id !== id));
    }

    /**
     * Clear all toasts
     */
    public clear(): void {
        this.toasts.set([]);
    }

    /**
     * Update an existing toast
     */
    public update(id: string, updates: Partial<ToastData>): void {
        this.toasts.update(toasts =>
            toasts.map(toast =>
                toast.id === id ? { ...toast, ...updates } : toast
            )
        );
    }

    /**
     * Convenience methods for different toast types
     */
    public success(message: string, options?: Omit<ToastOptions, 'type'>): string {
        return this.add(message, { ...options, type: 'success' });
    }

    public error(message: string, options?: Omit<ToastOptions, 'type'>): string {
        return this.add(message, { ...options, type: 'error' });
    }

    public warning(message: string, options?: Omit<ToastOptions, 'type'>): string {
        return this.add(message, { ...options, type: 'warning' });
    }

    public info(message: string, options?: Omit<ToastOptions, 'type'>): string {
        return this.add(message, { ...options, type: 'info' });
    }

    /**
     * Generate unique ID for toasts
     */
    private generateId(): string {
        return `toast-${++this.counter}-${Date.now()}`;
    }
}

// ========================================
// STORE INSTANCE AND HELPERS
// ========================================

// Create singleton instance
export const toast = new ToastStore();

// Helper functions for common use cases
export const toastHelpers = {
    /**
     * Show a success message for saved content
     */
    saveSuccess: (item: string = 'Changes') => {
        toast.success(`${item} saved successfully!`, {
            duration: 3000
        });
    },

    /**
     * Show an error message for save failures
     */
    saveError: (error?: string) => {
        toast.error(error || 'Failed to save changes. Please try again.', {
            persistent: true
        });
    },

    /**
     * Show a loading toast that can be updated
     */
    loading: (message: string = 'Loading...') => {
        return toast.info(message, {
            persistent: true,
            showClose: false
        });
    },

    /**
     * Update a loading toast to success
     */
    loadingSuccess: (id: string, message: string) => {
        toast.update(id, {
            type: 'success',
            message,
            persistent: false,
            duration: 3000,
            showClose: true
        });
    },

    /**
     * Update a loading toast to error
     */
    loadingError: (id: string, message: string) => {
        toast.update(id, {
            type: 'error',
            message,
            persistent: true,
            showClose: true
        });
    },

    /**
     * Show validation errors
     */
    validationError: (errors: string[]) => {
        const message = errors.length === 1
            ? errors[0]
            : `Please fix ${errors.length} validation errors`;

        toast.error(message, {
            title: 'Validation Error',
            duration: 6000
        });
    },

    /**
     * Show network error
     */
    networkError: () => {
        toast.error('Network error. Please check your connection and try again.', {
            title: 'Connection Error',
            persistent: true
        });
    },

    /**
     * Show auto-save status
     */
    autoSaved: () => {
        toast.success('Draft auto-saved', {
            duration: 2000,
            showIcon: false
        });
    },

    /**
     * Show confirmation with action
     */
    confirm: (message: string, onConfirm: () => void) => {
        return toast.warning(message, {
            title: 'Confirm Action',
            persistent: true,
            action: {
                label: 'Confirm',
                handler: onConfirm,
                style: 'primary'
            }
        });
    },

    /**
     * Show recipe published success
     */
    recipePublished: (title: string, slug: string) => {
        toast.success(`"${title}" has been published!`, {
            title: 'Recipe Published',
            duration: 5000,
            action: {
                label: 'View Recipe',
                handler: () => {
                    window.open(`/recipes/${slug}`, '_blank');
                },
                style: 'primary'
            }
        });
    },

    /**
     * Show image upload progress
     */
    uploadProgress: (filename: string) => {
        return toast.info(`Uploading ${filename}...`, {
            persistent: true,
            showClose: false
        });
    },

    /**
     * Show upload success
     */
    uploadSuccess: (id: string, filename: string) => {
        toast.update(id, {
            type: 'success',
            message: `${filename} uploaded successfully!`,
            persistent: false,
            duration: 3000,
            showClose: true
        });
    },

    /**
     * Show upload error
     */
    uploadError: (id: string, filename: string, error?: string) => {
        toast.update(id, {
            type: 'error',
            message: error || `Failed to upload ${filename}`,
            persistent: true,
            showClose: true
        });
    }
};

// ========================================
// TOAST CONTAINER COMPONENT HELPERS
// ========================================

export interface ToastContainerOptions {
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    maxToasts: number;
    spacing: number;
}

export const defaultToastContainerOptions: ToastContainerOptions = {
    position: 'top-right',
    maxToasts: 5,
    spacing: 8
};

// ========================================
// BROWSER STORAGE PERSISTENCE
// ========================================

export class ToastPersistence {
    private static STORAGE_KEY = 'ownchef_toast_queue';

    /**
     * Save pending toasts to localStorage
     */
    static save(toasts: ToastData[]): void {
        try {
            const persistentToasts = toasts.filter(t => t.persistent);
            localStorage.setItem(
                this.STORAGE_KEY,
                JSON.stringify(persistentToasts)
            );
        } catch (error) {
            console.warn('Failed to save toasts to localStorage:', error);
        }
    }

    /**
     * Load pending toasts from localStorage
     */
    static load(): ToastData[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) return [];

            const parsed = JSON.parse(stored) as ToastData[];

            // Filter out old toasts (older than 1 hour)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            return parsed.filter(toast =>
                new Date(toast.createdAt) > oneHourAgo
            );
        } catch (error) {
            console.warn('Failed to load toasts from localStorage:', error);
            return [];
        }
    }

    /**
     * Clear stored toasts
     */
    static clear(): void {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.warn('Failed to clear stored toasts:', error);
        }
    }
}

// ========================================
// ACCESSIBILITY HELPERS
// ========================================

export const toastA11y = {
    /**
     * Announce toast to screen readers
     */
    announce: (message: string, type: ToastData['type']) => {
        if (typeof window === 'undefined') return;

        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    },

    /**
     * Focus management for toasts with actions
     */
    focusToast: (toastElement: HTMLElement) => {
        const actionButton = toastElement.querySelector('button:not([data-close])') as HTMLElement;
        if (actionButton) {
            actionButton.focus();
        }
    }
};

// ========================================
// EXPORT DEFAULT INSTANCE
// ========================================

export default toast;