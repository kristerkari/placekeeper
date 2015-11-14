## Placekeeper - HTML5 placeholder attribute polyfill

[![NPM version][npm-image]][npm-url] [![Build Status](https://travis-ci.org/kristerkari/placekeeper.svg?branch=master)](https://travis-ci.org/kristerkari/placekeeper) [![Sauce Test Status](https://saucelabs.com/buildstatus/kristerkari)](https://saucelabs.com/u/kristerkari)
[![Coverage Status](https://coveralls.io/repos/kristerkari/placekeeper/badge.svg?branch=master)](https://coveralls.io/r/kristerkari/placekeeper?branch=master) [![Code Climate](https://codeclimate.com/github/kristerkari/placekeeper/badges/gpa.svg)](https://codeclimate.com/github/kristerkari/placekeeper)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/kristerkari.svg)](https://saucelabs.com/u/kristerkari)

[npm-url]: https://npmjs.org/package/placekeeper
[npm-image]: http://img.shields.io/npm/v/placekeeper.svg

Placekeeper is a HTML5 placeholder attribute polyfill for old browsers that lack support for it. It detects if browser supports HTML5 placeholder attribute and is only active when there is no browser support. The polyfill works standalone and can be used without a library like jQuery.

Placekeeper is built with testability, readability, modularity and clean code in mind. It borrows a lot of ideas, code and fixes from other polyfills, such as [Placeholders.js](https://github.com/jamesallardice/Placeholders.js) and [jquery-placeholder
](https://github.com/mathiasbynens/jquery-placeholder).

## Installing

You can find Placekeeper and adapter versions from the `dist` folder. You can also install Placekeeper using npm:

```sh
npm install placekeeper
```

## Usage

Include the Placekeeper's javascript on your page and it will be intialized automatically.

### HTML

```html
<input type="text" placeholder="Enter your name">
```

### CSS

The plugin automatically adds `class="placeholder"` to the elements who are currently showing their placeholder text. You can use this to style placeholder text differently:

```css
input, textarea { color: #000; }
.placeholder { color: #aaa; }
```

I’d suggest sticking to the `#aaa` color for placeholder text, as it’s the default in most browsers that support `@placeholder`. If you really want to, though, you can [style the placeholder text in some of the browsers that natively support it](http://stackoverflow.com/questions/2610497/change-an-inputs-html5-placeholder-color-with-css/2610741#2610741).

## Options

You can change Placekeeper settings by using `data-` attributes on your `<html>` or `<body>` tags. If you don't set any `data-` attributes, Placekeeper will run with default settings.

Example:

```html
<body data-placeholder-mode="input">
```

### data-placeholder-mode

Default: `focus`

__data-placeholder-mode="focus"__

Hides placeholder when input field is focused.

__data-placeholder-mode="input"__

Does not hide placeholder on focus, but hides it after user types text to the input field.

### data-placeholder-watch

Default: `true`

__data-placeholder-watch="false"__

Disables Placekeeper's feature that watches for placeholder attribute changes on input fields that are currently on the page.

## Browser support

All browsers from the last ~3-4 years support HTML5 placeholder attribute, so use this polyfill only if you want to support older browsers (e.g. Internet Explorer < 10 and older iOS/Android versions).

Placekeeper is heavily tested with unit tests and manual testing using several browsers that do not support the HTML5 placeholder attribute. If you notice that Placekeeper is not working with a browser, please open a new Github issue about it.

### Browser support for HTML5 placeholder attribute

- IE ✘ 5.5+ ✔ 10+
- Firefox ✘ 2+ ✔ 4+
- Chrome ✔
- Safari ◒ 3.1+ ✔ 5+
- Opera ✘ 9+ ◒ 11+ ✔ 11.5+
- iOS Safari ✔
- Opera Mini ✘
- Android Browser ✔ 2.1+ ◒ 4+ ✔ 4.2-4.3+
- Blackberry Browser ✔
- Opera Mobile ✘ 10+ ✔ 11+
- Chrome for Android ✔
- Firefox for Android ✔
- IE Mobile ✔
- UC Browser for Android ✔

ⓘ  Partial support in older Safari and Opera versions refers to lacking placeholder support on textarea elements.

### Avoiding Internet Explorer compatibility mode with older IE versions

> Internet Explorer has “Compatibility View”. Compatibility View makes IE behave like the older versions of Internet Explorer, the ones before Microsoft started paying more attention to web standards.

> It makes sense – there are a lot of websites out there that were written to render well on old versions of Internet Explorer, and Microsoft needed to make the move to standards compliance in a way that doesn’t break all of them.

> The problem is, Compatibility View can be a little… insistent.

- http://dalelane.co.uk/blog/?p=2222

Unfortunately compatibility mode can cause weird bugs to show up and break functionality. Sometimes compatibility mode is enabled by the user, sometimes by the browser.

Best way of stopping your page from going to compatibility mode and telling Internet Explorer to render in latest engine is to send a header from server side with the name `X-UA-Compatible` and value `IE=edge`.

## Development

To start developing make sure that you have [Node.js](https://nodejs.org/) installed.

### Install dependencies

Run `npm install` to install project dependencies.

### Unit tests

Unit tests are located in `test/unit` folder. Run tests with `npm test`. If you want to run unit tests using a watcher (TDD mode), use `npm run tdd`.

Tests are written using [Jasmine](https://jasmine.github.io/2.3/introduction.html) and [Karma](https://karma-runner.github.io) is used as test runner.

### Manual tests

You can start a development server by running `npm start`. Then open `http://localhost:8080` in your browser to see different plugin modes listed. Test files are located in `test/manual`.

### Testing older Internet Explorer versions

You can run Placekeeper's unit tests in older Internet Explorer versions for example by using [VirtualBox](https://www.virtualbox.org/) together with [ievms](https://github.com/xdissent/ievms).

After installing IE VMs, use `npm run tdd` to start Karma, start any of the VMs and open Internet Explorer with your local ip address and port 9876 (e.g. `http://10.0.1.2:9876`).

### Linting

Placekeeper uses a combination of [ESLint](http://eslint.org/), [JSHint](http://jshint.com/) and [JSCS](http://jscs.info/) to validate both code syntax and code style. Make sure that you use `npm run lint` to check that your code passes the validation.

If you are using Sublime Text or Atom as your code editor, it is recommended to install [SublimeLinter](https://github.com/SublimeLinter/SublimeLinter3) or [Linter](https://atom.io/packages/linter) for Atom + plugins for ESLint, JSHint and JSCS to enable live linting.

### Building

You can build source files to `dist` folder by using `npm run build`. _If you are making a contribution/pull request, make sure that you don't commit any files from `dist` folder together with your changes_.

## Contributing

Before you open a pull request with changes, make sure that:

- Your code has a unit test and the unit test passes on older browsers (e.g. IE7-10).
- All the existing tests are passing
- Your code passes linting: `npm run lint`
- You haven't committed any changes to Git for the files in `dist` folder

## License

The code is available under the [MIT license](https://github.com/kristerkari/placekeeper/blob/master/LICENSE.md).
