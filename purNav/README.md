# Pur - Lightweight Client-Side Router

Pur adalah library JavaScript sederhana untuk menangani routing di sisi klien (client-side routing) dengan mudah dan ringan.

## Fitur

- ✅ Routing sederhana dengan handler functions
- ✅ Navigation dengan atribut `purNav`
- ✅ Auto-active state untuk link aktif
- ✅ Support Shadow DOM
- ✅ History API integration
- ✅ Dynamic HTML loading
- ✅ Custom Components
- ✅ Event handling untuk route changes

## Instalasi

Tambahkan script berikut ke dalam HTML Anda:

```html
<script type="module">
    import pur from 'https://cdn.jsdelivr.net/gh/purujawa06-bot/myCdn/purNav/pur.js';
</script>
```

## Penggunaan Dasar

### 1. Inisialisasi dan Setup Routes

```javascript
// Set default route
pur.setDefaultRoute('/');

// Tambahkan routes
pur.addRoute('/', () => {
    document.getElementById('content').innerHTML = '<h1>Home Page</h1>';
});

pur.addRoute('/about', () => {
    document.getElementById('content').innerHTML = '<h1>About Us</h1>';
});

pur.addRoute('/contact', () => {
    document.getElementById('content').innerHTML = '<h1>Contact Page</h1>';
});
```

### 2. Navigation Links

Gunakan atribut `purNav` untuk membuat link navigasi:

```html
<nav>
    <a href="/" purNav="/">Home</a>
    <a href="/about" purNav="/about">About</a>
    <a href="/contact" purNav="/contact">Contact</a>
</nav>

<div id="content"></div>
```

### 3. Styling Link Aktif

Link yang aktif akan mendapatkan class `pur-active`:

```css
[purNav].pur-active {
    font-weight: bold;
    color: #007bff;
}
```

## API Reference

### Methods

#### `addRoute(path, handler)`
Menambahkan route baru.

```javascript
pur.addRoute('/users', () => {
    // Handler untuk route /users
    console.log('Users page loaded');
});
```

#### `setDefaultRoute(path)`
Mengatur route default.

```javascript
pur.setDefaultRoute('/home');
```

#### `navigate(url)`
Navigasi secara programmatic.

```javascript
pur.navigate('/about');
```

#### `loadHTML(url, container)`
Memuat HTML dari URL eksternal.

```javascript
pur.loadHTML('/partials/header.html', document.getElementById('header'))
    .then(() => console.log('HTML loaded'))
    .catch(err => console.error('Failed to load HTML:', err));
```

#### `createComponent(name, templateString, styles)`
Membuat custom component.

```javascript
pur.createComponent('my-header', 
    '<header><h1>My App</h1><slot></slot></header>',
    'h1 { color: blue; }'
);
```

### Events

#### `purRouteChange`
Event yang di-trigger ketika route berubah.

```javascript
window.addEventListener('purRouteChange', (event) => {
    console.log('Route changed to:', event.detail.route);
    console.log('Full URL:', event.detail.url);
});
```

## Contoh Lengkap

### HTML Structure

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Pur App</title>
    <style>
        nav a { margin: 0 10px; text-decoration: none; }
        nav a.pur-active { font-weight: bold; color: #007bff; }
        #content { padding: 20px; border: 1px solid #ddd; margin-top: 20px; }
    </style>
</head>
<body>
    <nav>
        <a href="/" purNav="/">Home</a>
        <a href="/about" purNav="/about">About</a>
        <a href="/contact" purNav="/contact">Contact</a>
        <a href="/products" purNav="/products">Products</a>
    </nav>

    <div id="content">Loading...</div>

    <script type="module">
        import pur from 'https://cdn.jsdelivr.net/gh/purujawa06-bot/myCdn/purNav/pur.js';

        // Setup routes
        pur.setDefaultRoute('/');
        
        pur.addRoute('/', () => {
            document.getElementById('content').innerHTML = `
                <h1>Welcome Home</h1>
                <p>This is the home page content.</p>
            `;
        });

        pur.addRoute('/about', () => {
            document.getElementById('content').innerHTML = `
                <h1>About Us</h1>
                <p>Learn more about our company.</p>
            `;
        });

        pur.addRoute('/contact', () => {
            document.getElementById('content').innerHTML = `
                <h1>Contact Us</h1>
                <p>Get in touch with our team.</p>
            `;
        });

        pur.addRoute('/products', () => {
            // Load HTML dari file eksternal
            pur.loadHTML('/partials/products.html', document.getElementById('content'))
                .catch(() => {
                    document.getElementById('content').innerHTML = '<p>Products page - content failed to load</p>';
                });
        });

        // Listen untuk route changes
        window.addEventListener('purRouteChange', (event) => {
            console.log('Navigated to:', event.detail.route);
        });
    </script>
</body>
</html>
```

### Contoh dengan Custom Components

```javascript
// Buat custom component
pur.createComponent('app-header', 
    `
    <header>
        <h1>My Application</h1>
        <nav>
            <a href="/" purNav="/">Home</a>
            <a href="/settings" purNav="/settings">Settings</a>
        </nav>
    </header>
    `,
    `
    header { 
        background: #333; 
        color: white; 
        padding: 1rem; 
    }
    header h1 { margin: 0; }
    header a { color: white; margin: 0 10px; }
    header a.pur-active { color: yellow; }
    `
);

// Gunakan component di HTML
// <app-header></app-header>
```

## Query Parameters

Pur mendukung query parameters. Handler bisa mengaksesnya melalui:

```javascript
pur.addRoute('/search', () => {
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get('q');
    
    document.getElementById('content').innerHTML = `
        <h1>Search Results</h1>
        <p>Searching for: ${query || 'nothing'}</p>
    `;
});

// Navigasi ke: /search?q=javascript
```

## Error Handling

```javascript
// Handle route not found
pur.setDefaultRoute('/404');

pur.addRoute('/404', () => {
    document.getElementById('content').innerHTML = `
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
    `;
});
```

## Browser Support

Pur bekerja di semua browser modern yang mendukung:
- ES6 Classes
- Map
- Custom Elements
- Shadow DOM
- History API

## License

MIT License - bebas digunakan untuk proyek personal dan komersial.

---

Dibuat dengan ❤️ untuk pengembangan web yang sederhana dan efisien.
