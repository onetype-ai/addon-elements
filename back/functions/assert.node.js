// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import elements from '#elements/back/addon.js';

elements.Fn('assert.node', function(node, report)
{
    this.forbidden = () =>
    {
        if(['style', 'script'].includes(node.tag))
        {
            report(node.line, 'No ' + node.tag + ' tag in the template, the look lives in the css beside and the logic in the render.');
        }

        for(const attr of node.attrs)
        {
            if(attr.name === 'style')
            {
                report(attr.line, 'No inline style, the look lives in the css beside the element.');
            }

            this.frozen(attr);
        }
    };

    this.frozen = (attr) =>
    {
        if(attr.name !== ':style')
        {
            return;
        }

        const code = String(attr.value).replace(/'[^']*'|"[^"]*"/g, '');

        if(!/[A-Za-z_$][\w$]*/.test(code))
        {
            report(attr.line, 'The :style holds a constant, a fixed look lives in a class, :style carries only living values.');
        }
    };

    this.naming = () =>
    {
        for(const name of node.classes)
        {
            if(!/^[a-z][a-z0-9-]*$/.test(name) || name.length > 10)
            {
                report(node.line, 'The class ' + name + ' breaks the naming, one lowercase word up to ten characters.');
            }
        }
    };

    this.forbidden();
    this.naming();
});
