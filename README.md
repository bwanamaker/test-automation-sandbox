# Test Automation Sandbox

A website containing varied page types for practicing automated testing.

## Setup

```sh
npm install
```

## Run locally

```sh
npm start
```

The terminal prints the local URL when the service starts, by default
`http://localhost:3000`. Set `PORT` to use another port.

Routes:

- `/` atomic-era welcome page with links to the e-commerce sandbox
- `/products` nine-product, national-park-inspired Wheelhouse bicycle catalog
- `/products/:slug` product details, quantity, and variant controls

The store keeps its original product slugs (for example, Acadia Roadster lives at
`/products/alder-roadster`) so existing automation links continue to work. Both
themes share the original Futura-first font stack; Futura must be installed on
the visitor's device, otherwise the existing fallback fonts are used.

## Tests

```sh
npx playwright install chromium
npm run test:unit
npm run test:playwright
```

Playwright starts the local server automatically. Coverage includes homepage
navigation, theme separation, all nine catalog-to-detail journeys, mobile layout,
product options, basket confirmations, and email validation.

## License

This project is licensed under the [MIT License](LICENSE).
