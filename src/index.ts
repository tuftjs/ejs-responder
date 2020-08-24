import type { ServerResponse } from 'http';
import type { TuftResponse } from 'tuft';

import ejs = require('ejs');

interface RenderObject {
  template?: string;
  filename?: string;
  data: { [key: string]: any };
  options: { [key: string]: any };
}

const DEFAULT_HTTP_STATUS = 200;
const HTML_CONTENT_TYPE = 'text/html; charset=UTF-8';

export function createEjsResponder() {
  return async function ejsResponder(
    tuftResponse: TuftResponse,
    response: ServerResponse,
  ) {
    const { render, status } = tuftResponse;

    if (typeof render !== 'object' || render === null) {
      // A 'render' object was not provided.
      return tuftResponse;
    }

    const { template, filename, data, options } = render as RenderObject;

    let body: string;

    if (filename) {
      // A filename has been provided, which takes precedence over any provided 'template' value.
      body = await ejs.renderFile(filename, data, options);
    }

    else if (template) {
      // A 'template' string has been provided.
      body = ejs.render(template as string, data, options);
    }

    else {
      // 'filename' and 'template' properties are both absent.
      return tuftResponse;
    }

    response
      .writeHead(status ?? DEFAULT_HTTP_STATUS, {
        ['content-type']: HTML_CONTENT_TYPE,
        ['content-length']: Buffer.byteLength(body),
      })
      .end(body);
  };
}
