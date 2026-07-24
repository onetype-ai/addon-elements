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
        code: function(data, compile, node)
        {
            if(!node.tagName || !node.tagName.toLowerCase().startsWith('e-') || node.tagName.toLowerCase() === 'e-bind')
            {
                return;
            }

            this.mount = (name, inputs, render) =>
            {
                render.Element.__otExternal = {
                    name,
                    key: inputs.key,
                    render,
                    data: inputs.data
                };

                node.replaceWith(render.Element);
            };

            const name = node.tagName.toLowerCase().substring(2);

            if(!elements.FnGet('render.' + name))
            {
                node.innerText = 'Element ' + name + ' does not exist.';

                return;
            }

            const inputs = elements.Fn('get.inputs', node, compile);
            const slots = elements.Fn('get.slots', node, compile.render, compile);

            this.mount(name, inputs, elements.render(name, inputs.data, inputs.wrapper, slots));
        }
    });
});
