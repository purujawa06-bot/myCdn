/**
 * PUR.JS - Modern Lightweight Framework
 * Features: SPA Router, Reactive State, Component System, Dynamic Head, Responsive Helpers
 */

export class Pur {
    constructor(config) {
        this.routes = config.routes || {};
        this.appContainer = document.querySelector(config.root || '#app');
        this.globalState = this.makeReactive(config.store || {});
        this.components = {};
        this.currentComponent = null;
        this.params = {};
        this.events = {};
        
        // Responsive State
        this.device = this.makeReactive({
            isMobile: window.innerWidth <= 768,
            width: window.innerWidth,
            theme: localStorage.getItem('pur-theme') || 'light'
        });

        this.init();
    }

    /**
     * Inisialisasi Event Listener dan Router
     */
    init() {
        // Handle Browser Navigation (Back/Forward)
        window.addEventListener('popstate', () => this.resolveRoute());
        
        // Handle Responsive Resize
        window.addEventListener('resize', () => {
            this.device.width = window.innerWidth;
            this.device.isMobile = window.innerWidth <= 768;
        });

        // Global Link Interceptor (SPA Feel)
        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('href'));
            }
        });

        // Initial Render
        this.resolveRoute();
        this.applyTheme(this.device.theme);
    }

    /**
     * Membuat object menjadi Reactive (Proxy)
     */
    makeReactive(data, callback = null) {
        const handler = {
            set: (target, key, value) => {
                target[key] = value;
                if (callback) callback(key, value);
                else this.render(); // Default re-render current component
                return true;
            }
        };
        return new Proxy(data, handler);
    }

    /**
     * Navigasi ke URL baru
     */
    navigate(path) {
        window.history.pushState({}, path, window.location.origin + path);
        this.resolveRoute();
    }

    /**
     * Mencocokkan URL dengan Route dan Parsing Parameter
     */
    resolveRoute() {
        const path = window.location.pathname;
        let matchedRoute = null;
        let params = {};

        // Cari route yang cocok (mendukung dynamic segment :id)
        for (const routePath in this.routes) {
            const routeRegex = new RegExp("^" + routePath.replace(/:\w+/g, '([^/]+)') + "$");
            const match = path.match(routeRegex);

            if (match) {
                matchedRoute = this.routes[routePath];
                
                // Ekstrak parameter values
                const paramKeys = (routePath.match(/:\w+/g) || []).map(k => k.substring(1));
                paramKeys.forEach((key, index) => {
                    params[key] = match[index + 1];
                });
                break;
            }
        }

        // Fallback 404
        if (!matchedRoute) {
            matchedRoute = this.routes['404'] || { 
                render: () => `<h1>404 Not Found</h1>`, 
                meta: { title: '404' } 
            };
        }

        this.params = params;
        this.loadComponent(matchedRoute);
    }

    /**
     * Load Component Lifecycle
     */
    async loadComponent(componentDefinition) {
        // 1. Unmount component lama
        if (this.currentComponent && this.currentComponent.onUnmount) {
            this.currentComponent.onUnmount(this.globalState);
        }

        this.currentComponent = componentDefinition;

        // 2. Update Header (SEO/Meta)
        this.updateHead(componentDefinition.meta);

        // 3. Mount Logic (Fetch data, etc)
        if (componentDefinition.onMount) {
            await componentDefinition.onMount({
                state: this.globalState,
                params: this.params,
                device: this.device
            });
        }

        // 4. Render
        this.render();
    }

    /**
     * Update Title & Meta Tags
     */
    updateHead(meta = {}) {
        document.title = meta.title || 'Pur App';
        
        // Update Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = "description";
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = meta.description || '';
    }

    /**
     * Core Render Function
     */
    render() {
        if (!this.currentComponent) return;

        // Generate HTML string dari component
        const html = this.currentComponent.render({
            state: this.globalState,
            params: this.params,
            device: this.device,
            link: (url) => `href="${url}" data-link` // Helper for links
        });

        this.appContainer.innerHTML = html;

        // Re-bind actions (onclick handlers in string HTML are tricky in modules, 
        // so we use a delegation helper or manual bind)
        this.bindEvents();
    }

    /**
     * Helper: Bind Event Actions dari atribut `data-action`
     */
    bindEvents() {
        const elements = this.appContainer.querySelectorAll('[data-action]');
        elements.forEach(el => {
            const actionName = el.getAttribute('data-action');
            el.onclick = (e) => {
                if (this.currentComponent.actions && this.currentComponent.actions[actionName]) {
                    this.currentComponent.actions[actionName]({
                        e,
                        state: this.globalState,
                        device: this.device
                    });
                }
            };
        });
    }

    /**
     * Helper: Toggle Theme
     */
    toggleTheme() {
        const newTheme = this.device.theme === 'light' ? 'dark' : 'light';
        this.device.theme = newTheme;
        localStorage.setItem('pur-theme', newTheme);
        this.applyTheme(newTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
}
