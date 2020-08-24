# EJS Responder

![Node.js CI](https://github.com/tuftjs/ejs-responder/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/tuftjs/ejs-responder/badge.svg)](https://coveralls.io/github/tuftjs/ejs-responder)
[![Known Vulnerabilities](https://snyk.io/test/github/tuftjs/ejs-responder/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tuftjs/ejs-responder?targetFile=package.json)

EJS Responder is a first-party extension for Tuft which allows the use of the EJS template engine for rendering views. For detailed information on how Tuft responders work, view the [official documentation](https://www.tuft.dev/docs/extensions/#responders).

## Installation
```
  $ npm install @tuft/ejs-responder
```

## Usage

Import the named `createEjsResponder` function, and then invoke it to create a Tuft responder that can be inserted into any Tuft application. The EJS responder will be triggered by any Tuft response object that contains a `render` property.

```js
  const { tuft } = require('tuft')
  const { createEjsResponder } = require('@tuft/ejs-responder')

  const app = tuft({
    responders: [createEjsResponder()]
  })

  app.set('GET /', () => {
    return {
      render: {
        template: '<h1>Welcome to <%= title %>!</h1>',
        data: { title: 'Tuft' }
      }
    }
  })
```

The example above will respond with the following HTML:

```html
  <h1>Welcome to Tuft!</h1>
```

EJS files are also supported via the `filename` property:

```js
  app.set('GET /', () => {
    return {
      render: {
        filename: './path/to/views/index.ejs',
        data: { title: 'Tuft' }
      }
    }
  })
```

## API

To utilize the EJS responder, add a `render` property to a Tuft response object and set it to an object containing one or more of the following properties:

* `template` - An EJS template string.
* `filename` - Path to an `*.ejs` file.
* `data` - An object containing the data to be inserted into the rendered HTML.
* `options` - An object of EJS options to be passed to the EJS rendering function.

If the both `template` and `filename` are present, then `template` will be ignored. If neither of them are present, the EJS responder will return handling of the response back to the Tuft application.

`data` and `options` are optional, although if the provided template references data that you fail to provide, then EJS will throw a `ReferenceError`.

## People
The creator and maintainer of EJS Responder is [Stuart Kennedy](https://github.com/rav2040).

## License
[MIT](https://github.com/tuftjs/ejs-responder/blob/master/LICENSE)
