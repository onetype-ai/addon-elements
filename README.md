# Elements

Elements is the front element registry and rendering engine of OneType. An element is a named render function with typed properties: registered once, it renders anywhere, from markup as an `e-` tag, from code, or from another element. No virtual DOM, no hooks: assign to `this` and the DOM patches itself.

- Package: `@onetype/addon-elements`, slug `onetype/addon/elements`
- Depends on: nothing. The `e-` tag markup syntax activates when the directives addon is present.
- Sides: `front/` (the engine), `back/` (ships the bundle)

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
