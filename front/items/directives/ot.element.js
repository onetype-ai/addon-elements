// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('directives', function(directives)
{
    directives.ItemAdd({
        id: 'ot-element',
        icon: 'auto_awesome',
        name: 'Element Load',
        description: 'Renders an element for every e- prefixed tag',
        trigger: 'node',
        order: 2500,
        strict: false,
        type: '1',
        code: function(data, item, compile, node)
        {
            const identifier = compile.identifier;

            if(!node.tagName || !node.tagName.toLowerCase().startsWith('e-') || node.tagName.toLowerCase() === 'e-bind')
            {
                return;
            }

            this.camel = (name) =>
            {
                return name.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
            };

            this.bound = (attributes, attribute) =>
            {
                try
                {
                    attributes.data[this.camel(attribute.name.substring(1))] = onetype.Function(attribute.value, compile.data, false);
                }
                catch(error)
                {
                    onetype.Error(400, '<:tag:> :attribute: failed: :reason:', {
                        tag: node.tagName.toLowerCase(),
                        attribute: attribute.name,
                        reason: error.message
                    });
                }
            };

            this.attribute = (attributes, attribute) =>
            {
                if(attribute.name.startsWith('#'))
                {
                    attributes.wrapper[this.camel(attribute.name.substring(1))] = attribute.value;

                    return;
                }

                if(attribute.name.startsWith(':'))
                {
                    return this.bound(attributes, attribute);
                }

                attributes.data[this.camel(attribute.name)] = attribute.value;
            };

            this.attributes = () =>
            {
                const attributes = {
                    wrapper: {},
                    data: {}
                };

                Array.from(node.attributes).forEach((attribute) => this.attribute(attributes, attribute));

                return attributes;
            };

            this.slot = (slots, child) =>
            {
                if(child.nodeType !== Node.ELEMENT_NODE)
                {
                    return;
                }

                const name = child.getAttribute('slot');

                if(!name)
                {
                    return;
                }

                child.removeAttribute('slot');

                slots[name] = {
                    html: child.outerHTML,
                    context: () => Object.assign({}, item.GetData(), compile.data)
                };
            };

            this.slots = () =>
            {
                const slots = {};

                Array.from(node.childNodes).forEach((child) => this.slot(slots, child));

                return slots;
            };

            this.key = (attributes) =>
            {
                const key = attributes.wrapper['ot-key']
                    || attributes.data['ot-key']
                    || compile.key
                    || identifier;

                delete attributes.wrapper['ot-key'];
                delete attributes.data['ot-key'];

                return key;
            };

            this.fail = (name) =>
            {
                node.innerText = 'Element ' + name + ' does not exist.';
            };

            this.mount = (name, render, key, values) =>
            {
                render.Element.__otExternal = {
                    name,
                    key,
                    render,
                    data: values
                };

                node.replaceWith(render.Element);
            };

            const name = node.tagName.toLowerCase().substring(2);

            if(!onetype.Addon('elements').FnGet('render.' + name))
            {
                return this.fail(name);
            }

            const attributes = this.attributes();
            const slots = this.slots();
            const key = this.key(attributes);
            const render = onetype.Addon('elements').Render(name, attributes.data, attributes.wrapper, slots);

            this.mount(name, render, key, attributes.data);
        }
    });
});
