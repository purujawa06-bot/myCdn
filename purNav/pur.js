// pur.js - Modern HTML Enhancement & SPA Navigation Module
// Version 1.0.0

class Pur {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.defaultRoute = null;
        this.init();
    }

    init() {
        // Process all purNav elements on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.processPurNavElements();
            this.setupHistoryListener();
            this.loadInitialRoute();
        });
    }

    // Process all purNav elements in the DOM
    processPurNavElements() {
        const navElements = document.querySelectorAll('[purNav]');
        
        navElements.forEach(element => {
            const url = element.getAttribute('purNav');
            
            if (url) {
                // Add click event listener
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigate(url);
                });
                
                // Add visual indication that this is a purNav element
                element.style.cursor = 'pointer';
                if (!element.hasAttribute('tabindex')) {
                    element.setAttribute('tabindex', '0');
                }
                
                // Add keyboard support
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.navigate(url);
                    }
                });
            }
        });
    }

    // Add a new route
    addRoute(path, handler) {
        this.routes[path] = handler;
        
        if (!this.defaultRoute) {
            this.defaultRoute = path;
        }
        
        return this; // Allow chaining
    }

    // Set default route
    setDefaultRoute(path) {
        if (this.routes[path]) {
            this.defaultRoute = path;
        }
        return this;
    }

    // Navigate to a URL
    navigate(url) {
        // Update browser history
        window.history.pushState({}, '', url);
        
        // Load the route
        this.loadRoute(url);
        
        // Update any active state indicators
        this.updateActiveStates(url);
    }

    // Load a route
    loadRoute(url) {
        const path = this.extractPath(url);
        const handler = this.routes[path];
        
        if (handler) {
            this.currentRoute = path;
            handler();
        } else if (this.defaultRoute) {
            this.currentRoute = this.defaultRoute;
            this.routes[this.defaultRoute]();
        }
        
        // Dispatch a custom event for route changes
        window.dispatchEvent(new CustomEvent('purRouteChange', {
            detail: { route: path, fullUrl: url }
        }));
    }

    // Extract path from URL
    extractPath(url) {
        const a = document.createElement('a');
        a.href = url;
        return a.pathname;
    }

    // Update active states for navigation elements
    updateActiveStates(url) {
        const path = this.extractPath(url);
        const navElements = document.querySelectorAll('[purNav]');
        
        navElements.forEach(element => {
            const elementUrl = element.getAttribute('purNav');
            const elementPath = this.extractPath(elementUrl);
            
            if (elementPath === path) {
                element.classList.add('pur-active');
            } else {
                element.classList.remove('pur-active');
            }
        });
    }

    // Handle browser history changes
    setupHistoryListener() {
        window.addEventListener('popstate', () => {
            this.loadRoute(window.location.href);
        });
    }

    // Load initial route
    loadInitialRoute() {
        const initialUrl = window.location.href;
        this.loadRoute(initialUrl);
    }

    // Utility method to load HTML content
    loadHTML(url, container, callback) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                if (container) {
                    container.innerHTML = html;
                    // Reprocess any purNav elements in the new content
                    this.processPurNavElements();
                }
                if (callback) callback(html);
            })
            .catch(error => {
                console.error('Error loading HTML:', error);
            });
    }

    // Utility method for creating components
    createComponent(name, template, style = '') {
        if (!customElements.get(name)) {
            class PurComponent extends HTMLElement {
                constructor() {
                    super();
                    
                    // Create shadow DOM
                    this.attachShadow({ mode: 'open' });
                    
                    // Add styles if provided
                    if (style) {
                        const styleElement = document.createElement('style');
                        styleElement.textContent = style;
                        this.shadowRoot.appendChild(styleElement);
                    }
                    
                    // Add template
                    this.shadowRoot.innerHTML += template;
                }
                
                connectedCallback() {
                    // Component is added to the DOM
                }
            }
            
            customElements.define(name, PurComponent);
        }
    }
}

// Initialize pur.js
const pur = new Pur();

// Make it available globally
window.pur = pur;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = pur;
}
