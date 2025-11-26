/**
 * Pur.js - Micro Framework untuk Modern SPA
 * Fitur: Virtual DOM (Lite), Router, Dynamic Header, CSS Injection
 */

export const Pur = (() => {
    // 1. Virtual DOM Engine Sederhana
    // Fungsi 'h' membuat Virtual Node
    const h = (tag, props = {}, children = []) => {
        return { tag, props, children: Array.isArray(children) ? children : [children] };
    };

    // Fungsi mengubah Virtual Node menjadi Real DOM
    const createNode = (vNode) => {
        if (typeof vNode === 'string' || typeof vNode === 'number') {
            return document.createTextNode(vNode);
        }

        const $el = document.createElement(vNode.tag);

        // Set attributes / props
        if (vNode.props) {
            Object.entries(vNode.props).forEach(([key, value]) => {
                if (key.startsWith('on') && typeof value === 'function') {
                    const eventName = key.substring(2).toLowerCase();
                    $el.addEventListener(eventName, value);
                } else if (key === 'className' || key === 'class') {
                    $el.setAttribute('class', value);
                } else {
                    $el.setAttribute(key, value);
                }
            });
        }

        // Recursively append children
        vNode.children.forEach(child => {
            $el.appendChild(createNode(child));
        });

        return $el;
    };

    // 2. Class Aplikasi Utama
    class App {
        constructor(config) {
            this.root = document.querySelector(config.root || '#app');
            this.routes = config.routes || {};
            this.globalState = config.state || {};
            this.customCSS = config.css || '';
            
            // Inject Custom CSS
            if (this.customCSS) {
                const styleTag = document.createElement('style');
                styleTag.innerHTML = this.customCSS;
                document.head.appendChild(styleTag);
            }

            // Handle Navigasi (SPA Link)
            window.addEventListener('popstate', () => this.render());
            
            // Initial Render
            this.render();
        }

        // Fungsi Navigasi tanpa reload
        navigate(path) {
            window.history.pushState({}, path, window.location.origin + path);
            this.render();
        }

        // Update Header Dinamis (Title & Meta)
        updateHead(meta) {
            if (!meta) return;
            if (meta.title) document.title = meta.title;
            // Update meta description jika ada
            if (meta.description) {
                let metaDesc = document.querySelector('meta[name="description"]');
                if (!metaDesc) {
                    metaDesc = document.createElement('meta');
                    metaDesc.name = "description";
                    document.head.appendChild(metaDesc);
                }
                metaDesc.content = meta.description;
            }
        }

        // Core Render Function
        render() {
            const path = window.location.pathname;
            // Cari route yang cocok, default ke '/' atau 404
            const componentBuilder = this.routes[path] || this.routes['404'] || this.routes['/'];
            
            // Reset root container
            this.root.innerHTML = '';

            if (componentBuilder) {
                // Generate Virtual Node dari Component
                const { view, head } = componentBuilder(this.globalState, (to) => this.navigate(to));
                
                // Update Head
                this.updateHead(head);

                // Convert VDOM to Real DOM & Mount
                const $dom = createNode(view);
                this.root.appendChild($dom);
            }
        }
    }

    return {
        h,     // Export hyperscript function
        init: (config) => new App(config)
    };
})();
