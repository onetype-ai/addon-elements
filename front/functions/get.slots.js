// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

elements.Fn('get.slots', function(node, item, compile)
{
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
            context: () => Object.assign({}, item ? item.GetData() : {}, compile.data)
        };
    };

    const slots = {};

    Array.from(node.childNodes).forEach((child) => this.slot(slots, child));

    return slots;
});
