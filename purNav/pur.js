// pur.js - Modern Web Framework
// Features: SPA, MODULAR, VIRTUAL DOM, RESPONSIVE
// Version: 1.0.0

class Pur {
    constructor(options = {}) {
        this.components = new Map();
        this.routes = new Map();
        this.currentRoute = null;
        this.state = new Proxy(options.state || {}, {
            set: (target, property, value) => {
                target[property] = value;
                this.render();
                return true;
            }
        });
        
        this.rootElement = options.root || '#app';
        this.init();
    }

    // Initialize the framework
    init() {
        this.setupRouter();
        this.render();
        this.setupResponsive();
    }

    // Virtual DOM implementation
    createElement(tag, props = {}, children = []) {
        return {
            tag,
            props,
            children
        };
    }

    // Render virtual DOM to actual DOM
    renderElement(vnode) {
        if (typeof vnode === 'string') {
            return document.createTextNode(vnode);
        }

        const element = document.createElement(vnode.tag);

        // Set properties
        Object.keys(vnode.props).forEach(prop => {
            if (prop.startsWith('on') && typeof vnode.props[prop] === 'function') {
                element.addEventListener(prop.slice(2).toLowerCase(), vnode.props[prop]);
            } else {
                element.setAttribute(prop, vnode.props[prop]);
            }
        });

        // Render children
        vnode.children.forEach(child => {
            element.appendChild(this.renderElement(child));
        });

        return element;
    }

    // Diff and patch virtual DOM
    patchDOM(parent, newVNode, oldVNode, index = 0) {
        if (!oldVNode) {
            parent.appendChild(this.renderElement(newVNode));
        } else if (!newVNode) {
            parent.removeChild(parent.childNodes[index]);
        } else if (this.hasChanged(newVNode, oldVNode)) {
            parent.replaceChild(this.renderElement(newVNode), parent.childNodes[index]);
        } else if (newVNode.tag) {
            const newChildren = newVNode.children;
            const oldChildren = oldVNode.children;
            const maxLen = Math.max(newChildren.length, oldChildren.length);

            for (let i = 0; i < maxLen; i++) {
                this.patchDOM(parent.childNodes[index], newChildren[i], oldChildren[i], i);
            }
        }
    }

    hasChanged(newVNode, oldVNode) {
        return typeof newVNode !== typeof oldVNode ||
               (typeof newVNode === 'string' && newVNode !== oldVNode) ||
               newVNode.tag !== oldVNode.tag;
    }

    // Main render method
    render() {
        const app = document.querySelector(this.rootElement);
        if (!app) return;

        const currentComponent = this.routes.get(this.currentRoute) || 
                               this.components.get('default');
        
        if (currentComponent) {
            const newVNode = currentComponent.render.call(this);
            this.patchDOM(app, newVNode, this.currentVNode);
            this.currentVNode = newVNode;
        }
    }

    // Component system
    component(name, component) {
        this.components.set(name, component);
        return this;
    }

    // Router system for SPA
    route(path, component) {
        this.routes.set(path, component);
        return this;
    }

    setupRouter() {
        // Handle initial route
        this.navigate(window.location.pathname);

        // Handle browser navigation
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname);
        });

        // Intercept link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigate(e.target.href);
            }
        });
    }

    navigate(path) {
        this.currentRoute = path;
        window.history.pushState(null, null, path);
        this.render();
    }

    // Responsive utilities
    setupResponsive() {
        // Add responsive CSS class to body
        document.body.classList.add('pur-responsive');

        // Handle window resize for responsive behavior
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 100);
        });

        this.handleResize();
    }

    handleResize() {
        const width = window.innerWidth;
        let size = 'xs';

        if (width >= 1200) size = 'xl';
        else if (width >= 992) size = 'lg';
        else if (width >= 768) size = 'md';
        else if (width >= 576) size = 'sm';

        document.body.setAttribute('data-screen-size', size);
    }

    // Utility methods
    $(selector) {
        return document.querySelector(selector);
    }

    $$(selector) {
        return document.querySelectorAll(selector);
    }

    // Event system
    on(event, handler) {
        document.addEventListener(event, handler);
        return this;
    }

    emit(event, detail) {
        document.dispatchEvent(new CustomEvent(event, { detail }));
    }
}

// Built-in components
const PurComponents = {
    // Responsive container
    Container: (props, children) => ({
        tag: 'div',
        props: { 
            class: `pur-container ${props.class || ''}`,
            ...props
        },
        children
    }),

    // Grid system
    Row: (props, children) => ({
        tag: 'div',
        props: { 
            class: `pur-row ${props.class || ''}`,
            ...props
        },
        children
    }),

    Col: (props, children) => ({
        tag: 'div',
        props: { 
            class: `pur-col pur-col-${props.size || '12'} ${props.class || ''}`,
            ...props
        },
        children
    }),

    // Navigation component
    Nav: (props, children) => ({
        tag: 'nav',
        props: { 
            class: `pur-nav ${props.class || ''}`,
            ...props
        },
        children
    })
};

// CSS as template literal for responsive design
const purCSS = `
.pur-responsive * {
    box-sizing: border-box;
}

.pur-container {
    width: 100%;
    margin: 0 auto;
    padding: 0 15px;
}

@media (min-width: 576px) {
    .pur-container { max-width: 540px; }
    [data-screen-size="sm"] .pur-responsive { font-size: 14px; }
}

@media (min-width: 768px) {
    .pur-container { max-width: 720px; }
    [data-screen-size="md"] .pur-responsive { font-size: 15px; }
}

@media (min-width: 992px) {
    .pur-container { max-width: 960px; }
    [data-screen-size="lg"] .pur-responsive { font-size: 16px; }
}

@media (min-width: 1200px) {
    .pur-container { max-width: 1140px; }
    [data-screen-size="xl"] .pur-responsive { font-size: 16px; }
}

.pur-row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15px;
}

.pur-col {
    padding: 0 15px;
    flex: 1 0 100%;
}

.pur-col-1 { flex: 0 0 8.333333%; max-width: 8.333333%; }
.pur-col-2 { flex: 0 0 16.666667%; max-width: 16.666667%; }
.pur-col-3 { flex: 0 0 25%; max-width: 25%; }
.pur-col-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
.pur-col-5 { flex: 0 0 41.666667%; max-width: 41.666667%; }
.pur-col-6 { flex: 0 0 50%; max-width: 50%; }
.pur-col-7 { flex: 0 0 58.333333%; max-width: 58.333333%; }
.pur-col-8 { flex: 0 0 66.666667%; max-width: 66.666667%; }
.pur-col-9 { flex: 0 0 75%; max-width: 75%; }
.pur-col-10 { flex: 0 0 83.333333%; max-width: 83.333333%; }
.pur-col-11 { flex: 0 0 91.666667%; max-width: 91.666667%; }
.pur-col-12 { flex: 0 0 100%; max-width: 100%; }

@media (max-width: 575px) {
    .pur-col { flex: 0 0 100%; max-width: 100%; }
}

.pur-nav {
    display: flex;
    padding: 1rem;
    background: #f8f9fa;
}

.pur-nav a {
    color: #007bff;
    text-decoration: none;
    padding: 0.5rem 1rem;
}

.pur-nav a:hover {
    background: #e9ecef;
}

[data-link] {
    cursor: pointer;
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = purCSS;
document.head.appendChild(style);

// Export for global use and modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Pur, PurComponents };
} else {
    window.Pur = Pur;
    window.PurComponents = PurComponents;
}
