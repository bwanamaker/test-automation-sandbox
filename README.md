# Test Automation Playground

A website containing varied page types for practicing automated testing.

## Live demo

The static site is published at [bwanamaker.github.io/test-automation-playground](https://bwanamaker.github.io/test-automation-playground/) after GitHub Pages is enabled for the repository. The deployed site includes the homepage, bicycle catalog and detail pages, and astronaut application at the same clean routes described below.

## Local development

```sh
npm install
```

## Run locally

```sh
npm start
```

This starts the local Node.js server. The terminal prints the local URL, by default
`http://localhost:3000`. Set `PORT` to use another port.

Routes:

- `/` atomic-era welcome page with links to the e-commerce playground
- `/products` nine-product, national-park-inspired Wheelhouse bicycle catalog
- `/products/:slug` product details, quantity, and variant controls
- `/astronaut-application` retro-futurist astronaut intake form with a randomized 5-15 second loading sequence

Product slugs match the park-themed names (for example, Acadia Roadster lives at
`/products/acadia-roadster` and Joshua Tree Gravel at `/products/joshua-tree-gravel`). Both
themes share the original Futura-first font stack; Futura must be installed on
the visitor's device, otherwise the existing fallback fonts are used.

## GitHub Pages deployment

GitHub Pages serves a static build; it does not run the local Node.js server. Build the Pages artifact locally with:

```sh
npm run build -- --base-path /test-automation-playground
```

This writes an uncommitted `dist/` directory with directory-based `index.html` files for each clean route and updates internal URLs for the GitHub Pages repository path.

The deployment workflow validates and builds the static site for pull requests. On a push to `main`, it publishes changes that affect the static site, build script, or workflow. To activate the first deployment, choose **GitHub Actions** under **Settings → Pages → Build and deployment** in the repository.

## Tests

```sh
npx playwright install chromium
npm run test:unit
npm run test:static
npm run test:playwright
```

The unit and Playwright suites exercise local development through the Node.js server. The static-site test verifies the GitHub Pages artifact has every route and correctly prefixed asset and navigation URLs. Playwright starts the local server automatically. Coverage includes homepage navigation, theme separation, all nine catalog-to-detail journeys, mobile layout, product options, basket confirmations, email validation, and astronaut application loading, form validation, and confirmation behavior.

## License

This project is licensed under the [MIT License](LICENSE).
