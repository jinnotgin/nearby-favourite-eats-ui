# nearby-favourite-eats-ui

Welcome to [FavEats](https://faveats.pages.dev) - helping you find nearby favourite eats! 🍱

FavEats does this by referencing your Burpple account and gathering the places that are currently in your wishlist.

This repository holds the UI for FavEats, which is then automatically deployed upon new commits using Cloudflare Pages (https://faveats.pages.dev).

Powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte);

## Live demo

https://faveats.pages.dev

## Todo

- [x] Add location / category support
- [x] Include Tailwind CSS into SvelteKit
- [x] Update UI with Tailwind as base
- [x] Set up PWA support
- [x] Component-ise svelte files
- [x] Add user authentication
- [x] Add multi-user support
- [ ] Improve profile page
- [ ] Add precise location coordinates picker
- [ ] Add multi-select for filtering categories

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte@next

# create a new project in my-app
npm init svelte@next my-app
```

> Note: the `@next` is temporary

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
