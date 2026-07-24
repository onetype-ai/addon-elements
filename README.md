# Elements

Elements is the front element registry and rendering engine of OneType. An element is a named render function with typed properties: registered once, it renders anywhere, from markup as an `e-` tag, from code, or from another element. No virtual DOM, no hooks: assign to `this` and the DOM patches itself.

- Package: `@onetype/addon-elements`, slug `onetype/addon/elements`
- Depends on: nothing. Supports: `onetype/addon/directives` (the `e-` tag markup syntax and the lifecycle observers activate with it) and `onetype/addon/canon` (pattern and placement items activate when canon is present).
- Sides: `front/` (the engine), `back/` (ships the bundle)

## Files and the canon

An element lives as a pair of files in its addon, one folder per element or one folder per group:

```
front/items/elements/post-card/card.js
front/items/elements/post-card/card.css
front/items/elements/forms/input.js
front/items/elements/forms/input.css
```

- The `.js` file holds exactly one registration, wrapped in `AddonReady`, nothing else:

```js
onetype.AddonReady('elements', (elements) =>
{
    elements.Item({ ... });
});
```

- Every `.js` file opens with exactly this banner on line 1, and no other comment anywhere. The `.css` file carries no banner and no `//` lines, css comments are `/* */`:

```
// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai
```
- The `.css` beside it is optional, but when it exists it must carry the same name, and a `.css` without its `.js` twin fails the sweep.
- Field order is law: `id`, `addon`, `icon`, `name`, `description`, `config`, `metadata`, `example`, `render`, then lifecycle hooks. Every config property is a full define with a `type`, a `description` and its default in `value:`, defaults never live in code. An `array` define names what it holds through `each`. When the shape of a row is known, and it almost always is, `each` is a real `object` define with its own `config` describing every field; `type: 'json'` is reserved for rows that are genuinely free-form. An `object` define follows the same law, `config` when the shape is known, `json` when it is not.

Defaults in `value:` are REAL defaults, what the element means when nobody passes anything: an empty array, an empty string, a sensible number. Demo rows never live in `value:`; showcase data belongs to `example`, the array of property sets a gallery previews the element with. The optional `example` field is that showcase. Identifiers everywhere carry at least three letters, `one` and `two` over `a` and `b`. Default data spells its rows riding the brackets:

```js
value: [{
    id: 'first',
    label: 'First'
}, {
    id: 'second',
    label: 'Second'
}],
each: {
    type: 'json',
    description: 'One row, an id and a label.'
}
```
- Data arrays spell their rows riding the brackets, `[{` ... `}, {` ... `}]`, one field per line inside.

## Composition and naming

An element renders anywhere as its tag, `e-` + the id: `id: 'lab-sidebar'` mounts as `<e-lab-sidebar>`, from markup or from another element's render. Ids carry their addon as a prefix (`lab-sidebar`, `admin-core-field`) so two addons never clash; the file beside keeps the short tail (`sidebar/sidebar.js`). The `addon` field is a label naming the owner, nothing needs registering anywhere else for an element to exist.

When a static class and `:class` meet on one node, the static part holds what is always there and `:class` holds only what changes: `class="link" :class="active === item.id ? 'on' : ''"`. Repeating the static name inside the `:class` string is waste, the classes merge.

The `example` field, when present, is an array of property sets a gallery can preview the element with:

```js
example: [{
    title: 'First post',
    count: 4
}]
```

## The canon in short

The linter holds every file to laws the render does not show: a line stops at 160 characters and a file at 160 lines, a function tells its story in fifteen own lines and decomposes into named steps on `this`, names carry at least three letters, one statement per line, every brace opens on its own line, comments do not exist beyond the banner, inline `||`/`&&` fallbacks in value position open their own line instead, data arrays ride their brackets. When the linter speaks, its message is the law; checking a `.css` runs the checks of the `.js` beside it.

## The render and its css

The render returns exactly one template literal of pure html:

- no `${}` ever, state binds through `{{ }}`, `:attribute` and `ot-*` directives;
- exactly one root element;
- no `<script>`, no `<style>`, no inline `style=""`; a truly dynamic value may ride `:style` (a progress width, a computed color), but a constant `:style` is a violation, fixed looks live in classes;
- classes are one lowercase word up to ten characters, like `box`, `card`, `title`; dynamic classes build ONE string through `:class="'card ' + tone"`, an object form does not exist;
- every static class must appear in the css beside, an unstyled class is a violation.

The css is scoped by the hash of the element. The engine stamps class `e-<hash>` on the wrapper tag, where `hash = GenerateHash('elements-' + id)`. Compute it with this exact line, replacing the id:

```
node -e "const n='elements-post-card';let h=0;for(let i=0;i<n.length;i++){h=(h<<5)-h+n.charCodeAt(i);h|=0;}console.log('e-'+Math.abs(h).toString(16))"
```


Every selector opens with that class and walks down with `>` only:

```css
.e-561166d2 > .box > .card { }
.e-561166d2 > .box > .card:hover { }
```

- only `>` between steps, never a space, `+` or `~`;
- every step opens with a class, never a bare tag, an id or `*`;
- the walked structure must exist in the template, a selector into markup the render does not build is a violation;
- no `!important`, no `@import`, of the at-rules only `@media` and `@keyframes` may appear, and every keyframes name opens with the hash, `@keyframes e-561166d2-sway`;
- content injected at runtime through `ot-html` or `ot-node` styles itself, the css of the element cannot reach below such a node.

## Define an element

```js
elements.Item({
    id: 'post-card',
    addon: 'blog',
    name: 'Post Card',
    description: 'One post as a card.',
    config: {
        title: {
            type: 'string',
            value: 'Untitled',
            description: 'The card title.'
        },
        count: {
            type: 'number',
            value: 0,
            description: 'How many comments the post carries.'
        }
    },
    render: function()
    {
        this.bump = () =>
        {
            this.count = this.count + 1;
        };

        return `
            <div class="card" ot-click="bump()">
                <h3>{{ title }}</h3>
                <p>{{ count }}</p>
                <slot name="footer"></slot>
            </div>
        `;
    }
});
```

`config` uses the same define system as everything else in OneType: properties arrive typed and validated, absences take the schema default. `render` runs once per instance; everything assigned to `this` is reactive state, the returned template is the markup.

Field reference: `id` (dashed, becomes the tag name), `addon`, `icon`, `name`, `description`, `category`, `author`, `collection` (presentation and grouping), `config` (property defines), `metadata`, `example` (property sets for previews), `render`, and the lifecycle hooks below.

## Lifecycle hooks

An element may declare `visible`, `resize`, `click`, `scroll`, `hover` and `destroy`. Every hook runs with the render instance as `this`, so assigning state repatches the DOM:

```js
elements.Item({
    id: 'reveal-box',
    description: 'Shows itself when it scrolls into view.',
    config: {
        clicks: { type: 'number', value: 0, description: 'How many clicks landed.' }
    },
    render: function()
    {
        this.seen = false;

        return '<div class="box" ot-if="seen">{{ clicks }}</div>';
    },
    visible: function(node, item)
    {
        this.seen = true;
    },
    click: function(click, node, item)
    {
        this.clicks = this.clicks + 1;
    },
    scroll: function(scroll, node, item)
    {
        this.progress = scroll.progress;
    }
});
```

Signatures: `visible` and `resize` receive `(node, item)`; `click`, `scroll` and `hover` receive their payload first, `(payload, node, item)`. Observers wire only for the hooks the element declares; when the element leaves the document they release and `destroy(node, item)` runs last.

## Use an element in markup

```html
<e-post-card title="Zdravo" :count="post.comments" #class="hero">
    <div slot="footer">Footer content</div>
</e-post-card>
```

The `ot-element` directive picks up every `e-` prefixed tag:

- plain attributes pass as strings, dashed names arrive camelCased
- `:attribute` evaluates against the surrounding compile data and passes the typed result
- `#attribute` lands on the wrapper element instead of the element state
- children with a `slot` attribute fill the matching `<slot name>` in the template
- `ot-key` (attribute or `#ot-key`) keys the instance for list rendering
- an unknown element writes `Element x does not exist.` in place, loudly visible

## Render from code

```js
const render = elements.render('post-card', { title: 'Zdravo', count: 3 });

document.body.appendChild(render.Element);
```

`elements.render(name, data, attributes, slots)` returns the live render instance: `render.Element` is the DOM node, state changes patch it in place, lifecycle hooks wire on mount.

## Templates

Templates speak the directives vocabulary: `{{ value }}` interpolation, `ot-if`, `ot-for`, `ot-click` and the rest, `:attribute` binding, `<slot name>` insertion. When state changes, only the parts that differ re-render; focus, scroll and input state survive.

## Guarantees

- Properties are typed and validated through defines, the schema carries the defaults.
- One registration, three doors: markup tag, code render, composition inside other templates.
- An unknown element never fails silently: the tag says so in place.
