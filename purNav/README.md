
# Pur.js - Modern Web Framework

Pur.js adalah framework JavaScript modern untuk membangun website dengan fitur Single Page Application (SPA), sistem modular, Virtual DOM, dan desain responsive.

## Fitur Utama

- 🚀 **SPA (Single Page Application)** - Navigasi tanpa reload halaman
- 🧩 **Modular** - Sistem komponen yang terstruktur
- ⚡ **Virtual DOM** - Rendering yang cepat dan efisien
- 📱 **Responsive** - Desain yang adaptif untuk semua perangkat

## Instalasi

### Via CDN (Recommended)

Tambahkan script berikut di HTML Anda:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Pur.js App</title>
</head>
<body>
    <div id="app"></div>

    <!-- Load Pur.js from CDN -->
    <script src="https://cdn.jsdelivr.net/gh/purujawa06-bot/myCdn/purNav/pur.js"></script>
    
    <script>
        // Your app code here
        const app = new Pur({
            root: '#app',
            state: {
                message: 'Hello Pur.js!'
            }
        });

        app.component('home', {
            render() {
                return PurComponents.Container({}, [
                    PurComponents.Row({}, [
                        PurComponents.Col({ size: '6' }, [
                            this.createElement('h1', {}, ['Welcome to Pur.js']),
                            this.createElement('p', {}, [this.state.message]),
                            this.createElement('button', {
                                onclick: () => {
                                    this.state.message = 'Message updated!';
                                }
                            }, ['Click Me'])
                        ])
                    ])
                ]);
            }
        });

        app.route('/', app.components.get('home'));
    </script>
</body>
</html>
```

### Via NPM (Coming Soon)

```bash
npm install pur.js
```

## Penggunaan Cepat

### 1. Inisialisasi Aplikasi

```javascript
const app = new Pur({
    root: '#app',
    state: {
        count: 0,
        user: { name: 'John' }
    }
});
```

### 2. Membuat Komponen

```javascript
app.component('counter', {
    render() {
        return this.createElement('div', { class: 'counter' }, [
            this.createElement('h2', {}, ['Counter: ' + this.state.count]),
            this.createElement('button', {
                onclick: () => { this.state.count++; }
            }, ['Increment'])
        ]);
    }
});
```

### 3. Setup Routing

```javascript
app.route('/', app.components.get('counter'));
app.route('/about', {
    render() {
        return this.createElement('div', {}, [
            this.createElement('h1', {}, ['About Page']),
            this.createElement('a', { 
                href: '/', 
                'data-link': true 
            }, ['Back to Home'])
        ]);
    }
});
```

### 4. Komponen Bawaan

```javascript
// Responsive container
PurComponents.Container({ class: 'my-container' }, [
    // children
]);

// Grid system
PurComponents.Row({}, [
    PurComponents.Col({ size: '6' }, ['Column 1']),
    PurComponents.Col({ size: '6' }, ['Column 2'])
]);

// Navigation
PurComponents.Nav({}, [
    this.createElement('a', { href: '/', 'data-link': true }, ['Home']),
    this.createElement('a', { href: '/about', 'data-link': true }, ['About'])
]);
```

## API Reference

### Pur Constructor

| Parameter | Type | Description |
|-----------|------|-------------|
| root | string | CSS selector untuk root element |
| state | object | State global aplikasi |

### Methods

- `component(name, definition)` - Mendaftarkan komponen
- `route(path, component)` - Mendefinisikan route
- `navigate(path)` - Navigasi ke route tertentu
- `createElement(tag, props, children)` - Membuat virtual node

## Contoh Lengkap

```html
<!DOCTYPE html>
<html>
<head>
    <title>Pur.js Example</title>
</head>
<body>
    <div id="app"></div>

    <script src="https://cdn.jsdelivr.net/gh/purujawa06-bot/myCdn/purNav/pur.js"></script>
    
    <script>
        const app = new Pur({
            root: '#app',
            state: {
                title: 'My App',
                posts: []
            }
        });

        // Header component
        app.component('header', {
            render() {
                return PurComponents.Nav({}, [
                    this.createElement('a', { 
                        href: '/', 
                        'data-link': true 
                    }, ['Home']),
                    this.createElement('a', { 
                        href: '/posts', 
                        'data-link': true 
                    }, ['Posts'])
                ]);
            }
        });

        // Home page
        app.component('home', {
            render() {
                return this.createElement('div', {}, [
                    app.components.get('header').render.call(this),
                    PurComponents.Container({}, [
                        this.createElement('h1', {}, [this.state.title]),
                        this.createElement('p', {}, ['Welcome to our Pur.js application!'])
                    ])
                ]);
            }
        });

        // Setup routes
        app.route('/', app.components.get('home'));
        app.route('/posts', {
            render() {
                return this.createElement('div', {}, [
                    app.components.get('header').render.call(this),
                    PurComponents.Container({}, [
                        this.createElement('h1', {}, ['Blog Posts']),
                        this.createElement('p', {}, ['Posts will be displayed here...'])
                    ])
                ]);
            }
        });
    </script>
</body>
</html>
```

## Browser Support

Pur.js mendukung semua browser modern:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Lisensi

MIT License - bebas digunakan untuk proyek personal dan komersial.
```

## Keunggulan Pur.js:

1. **SPA**: Router built-in dengan history management
2. **Modular**: Sistem komponen yang reusable
3. **Virtual DOM**: Rendering efisien dengan diffing algorithm
4. **Responsive**: Grid system dan utility classes untuk semua device

Framework ini siap digunakan langsung via CDN dengan performa optimal dan ukuran file yang ringan!
