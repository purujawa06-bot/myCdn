class Pur {
    constructor() {
        this.routes = new Map();
        this.defaultRoute = null;
        this.currentUrl = null;
        
        if (document.readyState === 'complete') {
            this.init();
        } else {
            window.addEventListener('DOMContentLoaded', () => this.init());
        }
    }

    init() {
        document.body.addEventListener('click', (e) => this.handleClick(e));
        window.addEventListener('popstate', () => this.resolve());
        this.resolve();
    }

    handleClick(e) {
        const target = e.composedPath().find(el => el.hasAttribute && el.hasAttribute('purNav'));
        if (target) {
            e.preventDefault();
            const url = target.getAttribute('purNav');
            this.navigate(url);
        }
    }

    addRoute(path, handler) {
        this.routes.set(path, handler);
        if (!this.defaultRoute) this.defaultRoute = path;
        return this;
    }

    setDefaultRoute(path) {
        this.defaultRoute = path;
        return this;
    }

    navigate(url) {
        if (this.currentUrl === url) return;
        window.history.pushState({}, '', url);
        this.resolve();
    }

    resolve() {
        this.currentUrl = window.location.pathname + window.location.search;
        const path = window.location.pathname;
        const handler = this.routes.get(path) || (this.defaultRoute ? this.routes.get(this.defaultRoute) : null);

        this.updateActiveState(path);

        if (handler) {
            handler();
            window.dispatchEvent(new CustomEvent('purRouteChange', { detail: { route: path, url: this.currentUrl } }));
        }
    }

    updateActiveState(currentPath) {
        const updateLinks = (root) => {
            const links = root.querySelectorAll('[purNav]');
            links.forEach(link => {
                const linkUrl = link.getAttribute('purNav');
                const linkPath = linkUrl.split('?')[0];
                if (linkPath === currentPath) {
                    link.classList.add('pur-active');
                } else {
                    link.classList.remove('pur-active');
                }
            });
        };

        updateLinks(document);
        
        document.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) updateLinks(el.shadowRoot);
        });
    }

    loadHTML(url, container) {
        return fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                return res.text();
            })
            .then(html => {
                if (container) container.innerHTML = html;
                return html;
            });
    }

    createComponent(name, templateString, styles = '') {
        if (customElements.get(name)) return;

        class PurComponent extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }

            connectedCallback() {
                const styleEl = styles ? `<style>${styles}</style>` : '';
                this.shadowRoot.innerHTML = `${styleEl}${templateString}`;
            }
        }

        customElements.define(name, PurComponent);
    }
}

const pur = new Pur();
window.pur = pur;
export default pur;
