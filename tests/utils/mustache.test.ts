import { apply } from "../../lib/template";

describe("test for apply template", () => {
  test("apply_simple_markdown", async () => {
    const template = `
    <html>
    <body onload="renderHello()">
      <div id="target">Loading...</div>
      <script id="template" type="x-tmpl-mustache">
        Hello {{ name }}!
      </script>
      <script src="https://unpkg.com/mustache@latest"></script>
      <script src="render.js"></script>
    </body>
    </html>`;
    const expected = `
    <html>
    <body onload="renderHello()">
      <div id="target">Loading...</div>
      <script id="template" type="x-tmpl-mustache">
        Hello tester!
      </script>
      <script src="https://unpkg.com/mustache@latest"></script>
      <script src="render.js"></script>
    </body>
    </html>`;
    const markdown = { name: "tester" };
    const rendered = apply(template, markdown);
    expect(rendered).toBe(expected);
  });
  test("apply_object_markdown", async () => {
    const template = `
    <html>
    <body onload="renderHello()">
      <div id="target">Loading...</div>
      <script id="template" type="x-tmpl-mustache">
        Hello {{ name.firstname }} {{name.lastname}}!
      </script>
      <script src="https://unpkg.com/mustache@latest"></script>
      <script src="render.js"></script>
    </body>
    </html>`;
    const expected = `
    <html>
    <body onload="renderHello()">
      <div id="target">Loading...</div>
      <script id="template" type="x-tmpl-mustache">
        Hello John Doe!
      </script>
      <script src="https://unpkg.com/mustache@latest"></script>
      <script src="render.js"></script>
    </body>
    </html>`;
    const markdown = { name: { firstname: "John", lastname: "Doe" } };
    const rendered = apply(template, markdown);
    expect(rendered).toBe(expected);
  });
  test("apply_list_markdown", async () => {
    const template = `
    <html>
    <body onload="renderHello()">
      <div id="target">Loading...</div>
      <script id="template" type="x-tmpl-mustache">
        {{#names}}
        Hello {{.}} !
        {{/names}}
      </script>
      <script src="https://unpkg.com/mustache@latest"></script>
      <script src="render.js"></script>
    </body>
    </html>`;
    const expected = `
    <html>
    <body onload="renderHello()">
      <div id="target">Loading...</div>
      <script id="template" type="x-tmpl-mustache">
        Hello A !
        Hello B !
        Hello C !
      </script>
      <script src="https://unpkg.com/mustache@latest"></script>
      <script src="render.js"></script>
    </body>
    </html>`;
    const markdown = {
      names: ["A", "B", "C"],
    };
    const rendered = apply(template, markdown);
    expect(rendered).toBe(expected);
  });
  test("apply_dict_markdown", async () => {
    const template = `
    <html>
    <body onload="renderHello()">
      <div id="target">Loading...</div>
      <script id="template" type="x-tmpl-mustache">
        {{#names}}
        Hello {{letter}} !
        {{/names}}
      </script>
      <script src="https://unpkg.com/mustache@latest"></script>
      <script src="render.js"></script>
    </body>
    </html>`;
    const expected = `
    <html>
    <body onload="renderHello()">
      <div id="target">Loading...</div>
      <script id="template" type="x-tmpl-mustache">
        Hello A !
        Hello B !
        Hello C !
      </script>
      <script src="https://unpkg.com/mustache@latest"></script>
      <script src="render.js"></script>
    </body>
    </html>`;
    const markdown = {
      names: [{ letter: "A" }, { letter: "B" }, { letter: "C" }],
    };
    const rendered = apply(template, markdown);
    expect(rendered).toBe(expected);
  });
});
