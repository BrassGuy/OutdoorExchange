# Outdoor Exchange - Premium American Outdoor Wear

A modern, multi-page e-commerce demo site showcasing premium American-made outdoor apparel and equipment. 100 % vanilla HTML, CSS & JavaScript – no build tools, no frameworks, lightning-fast.

## Pages & Navigation

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Landing page with full-screen hero, featured categories and brand story. |
| Shop | `shop.html` | Product grid with client-side filters & sort (category, price, features) powered by `shop-script.js`. Supports query-string deep-linking e.g. `shop.html?category=jackets`. |
| Our Heritage | `heritage.html` | Long-form storytelling page detailing the brand's history & values. |

Navigate via the fixed top navigation bar on desktop or the slide-out menu on mobile. All internal links are relative so the site works from the project root, a sub-folder, or on GitHub Pages.

## Features

- 📱 **Responsive**: Mobile-first layout using CSS Grid & Flexbox.
- ⚡ **No dependencies**: Zero JS libraries, zero CSS frameworks.
- 🛒 **Shop filters**: Instant client-side filtering & sorting.  
- 🔍 **Accessible search / keyboard navigation**.
- 🖼️ **Lazy-loaded images** via the Intersection Observer API.
- 🧩 **Modular code**: Separate CSS/JS for the shop to keep the base bundle lean.
- 🌐 **SEO**: Semantic markup & social meta tags.

## Updated Project Structure

```
huntinggear/
├── index.html          # Home page
├── heritage.html       # Our Heritage page
├── shop.html           # Shop / product catalogue
├── styles.css          # Shared styles
├── shop-styles.css     # Additional styles only used on shop.html
├── script.js           # Shared site interactions (menu, search, etc.)
├── shop-script.js      # Logic specific to shop.html
├── images/             # Optimised image assets
└── README.md           # You are here
```

## Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/huntinggear.git
   cd huntinggear
   ```
2. Open `index.html` in any modern browser OR run a small server (recommended):
   ```bash
   # Python 3.x
   python -m http.server 8000
   # then visit http://localhost:8000
   ```

## Deploying to GitHub Pages

The site is 100 % static, so deployment is as simple as enabling GitHub Pages:

1. Push/commit your code to the `main` (or `master`) branch.
2. In the repository **Settings → Pages** section, set
   - **Source**: `main` branch
   - **Folder**: `/ (root)`
3. Save – GitHub builds & deploys automatically. In ~1 minute your site will be live at:
   ```
   https://<your-username>.github.io/huntinggear/
   ```
4. Every push to `main` triggers a re-deploy. Preview changes in a feature branch, then merge.

### Custom Domain

Add your custom domain in **Settings → Pages** and create a CNAME record pointing at `<your-username>.github.io`. A `CNAME` file will be generated automatically.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. `git checkout -b feature/your-feature`
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/your-feature`)
5. Open a PR

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Credits

Created by **Pezzolla Web Studios** as a portfolio demonstration. Product images courtesy of [Unsplash](https://unsplash.com) & icons from [Font Awesome](https://fontawesome.com). 