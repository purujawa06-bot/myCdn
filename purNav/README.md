# pur.js - Modern HTML Enhancement & SPA Navigation

pur.js adalah modul JavaScript ringan untuk membuat website HTML lebih modern dengan navigasi SPA (Single Page Application).

## Fitur

- **SPA Navigation**: Navigasi antar halaman tanpa reload
- **Modern HTML Components**: Membuat komponen web modern
- **Lightweight**: Ringan dan cepat
- **Easy to Use**: Sintaks yang sederhana dan intuitif

## Instalasi

Tambahkan pur.js ke proyek Anda:

```html
<script src="https://cdn.jsdelivr.net/gh/username/pur.js/pur.js"></script>
```

Atau gunakan sebagai modul:

```javascript
import pur from './pur.js';
```

## Penggunaan

### 1. Navigasi SPA

Gunakan atribut `purNav` untuk membuat elemen navigasi SPA:

```html
<!-- Navigasi sederhana -->
<a purNav="/home">Home</a>
<a purNav="/about">About</a>
<a purNav="/contact">Contact</a>

<!-- Bisa digunakan di elemen apapun -->
<button purNav="/dashboard">Dashboard</button>
<div purNav="/profile" class="nav-item">Profile</div>
```

### 2. Mendefinisikan Rute

```javascript
// Tambahkan rute
pur.addRoute('/', () => {
    document.getElementById('content').innerHTML = '<h1>Home Page</h1>';
});

pur.addRoute('/about', () => {
    document.getElementById('content').innerHTML = '<h1>About Us</h1>';
});

pur.addRoute('/contact', () => {
    document.getElementById('content').innerHTML = '<h1>Contact Page</h1>';
});

// Atau dalam bentuk chaining
pur.addRoute('/', homeHandler)
   .addRoute('/about', aboutHandler)
   .addRoute('/contact', contactHandler)
   .setDefaultRoute('/');
```

### 3. Memuat Konten HTML Eksternal

```javascript
pur.addRoute('/products', () => {
    pur.loadHTML('/partials/products.html', document.getElementById('content'));
});
```

### 4. Membuat Komponen Kustom

```javascript
// Membuat komponen kustom
pur.createComponent('pur-header', `
    <header>
        <h1>My Website</h1>
        <nav>
            <a purNav="/">Home</a>
            <a purNav="/about">About</a>
        </nav>
    </header>
`, `
    header {
        background: #333;
        color: white;
        padding: 1rem;
    }
    nav a {
        color: white;
        margin-right: 1rem;
        text-decoration: none;
    }
    nav a.pur-active {
        font-weight: bold;
        text-decoration: underline;
    }
`);

// Gunakan komponen di HTML
// <pur-header></pur-header>
```

### 5. Event Handling

```javascript
// Dengarkan perubahan rute
window.addEventListener('purRouteChange', (event) => {
    console.log('Route changed to:', event.detail.route);
});
```

## API Reference

### pur.addRoute(path, handler)
Menambahkan rute baru.

### pur.navigate(url)
Navigasi ke URL tertentu.

### pur.setDefaultRoute(path)
Mengatur rute default.

### pur.loadHTML(url, container, callback)
Memuat konten HTML ke dalam container.

### pur.createComponent(name, template, style)
Membuat komponen web kustom.

## Contoh Lengkap

```html
<!DOCTYPE html>
<html>
<head>
    <title>My SPA</title>
    <script src="pur.js"></script>
    <style>
        .nav-item {
            display: inline-block;
            padding: 10px;
            margin: 5px;
            background: #eee;
            cursor: pointer;
        }
        .nav-item.pur-active {
            background: #007bff;
            color: white;
        }
    </style>
</head>
<body>
    <div class="nav-item" purNav="/">Home</div>
    <div class="nav-item" purNav="/about">About</div>
    <div class="nav-item" purNav="/contact">Contact</div>
    
    <div id="content"></div>

    <script>
        // Define routes
        pur.addRoute('/', () => {
            document.getElementById('content').innerHTML = '<h1>Welcome Home</h1>';
        });
        
        pur.addRoute('/about', () => {
            document.getElementById('content').innerHTML = '<h1>About Us</h1><p>We are a great company!</p>';
        });
        
        pur.addRoute('/contact', () => {
            document.getElementById('content').innerHTML = '<h1>Contact Us</h1><p>Email: info@example.com</p>';
        });
    </script>
</body>
</html>
```

## Browser Support

pur.js mendukung semua browser modern yang mendukung:
- ES6 Classes
- Fetch API
- Custom Elements
- Shadow DOM (untuk komponen)

## Lisensi

MIT License - bebas digunakan untuk proyek personal dan komersial.
