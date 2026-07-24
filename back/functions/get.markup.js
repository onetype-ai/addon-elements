// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import elements from '#elements/back/addon.js';

elements.Fn('get.markup', function(raw, offset)
{
    const voids = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'];
    const roots = [];
    const stack = [];
    const errors = [];
    const expressions = [];
    const token = /<!--[\s\S]*?-->|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>|\{\{([\s\S]*?)\}\}/g;

    this.line = (index) =>
    {
        return offset + raw.slice(0, index).split('\n').length - 1;
    };

    this.scope = () =>
    {
        return stack.length ? stack[stack.length - 1].scope : [];
    };

    this.attributes = (text, place) =>
    {
        const list = [];
        const pair = /([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'))?/g;

        for(let match; (match = pair.exec(text));)
        {
            const value = match[2] === undefined ? match[3] : match[2];

            list.push({
                name: match[1],
                value: value,
                line: place
            });
        }

        return list;
    };

    this.build = (match) =>
    {
        const place = this.line(match.index);
        const attrs = this.attributes(match[3], place);
        const loops = attrs
            .map((attr) => /^\s*(\w+)(?:\s*,\s*(\w+))?\s+in\s+\S/.exec(String(attr.value)))
            .filter(Boolean)
            .flatMap((match) => match[2] ? [match[1], match[2]] : [match[1]]);
        const grown = this.scope().concat(loops);

        return {
            tag: match[2].toLowerCase(),
            attrs: attrs,
            classes: attrs.filter((attr) => attr.name === 'class').flatMap((attr) => String(attr.value).split(/\s+/).filter(Boolean)),
            dynamic: attrs.some((attr) => attr.name === ':class'),
            scope: grown,
            children: [],
            line: place
        };
    };

    this.open = (match) =>
    {
        const node = this.build(match);
        const parent = stack.length ? stack[stack.length - 1].children : roots;

        parent.push(node);

        for(const attr of node.attrs)
        {
            if(attr.name.startsWith(':') || attr.name.startsWith('ot-'))
            {
                expressions.push({
                    code: String(attr.value),
                    line: node.line,
                    scope: node.scope,
                    name: attr.name
                });
            }
        }

        if(!voids.includes(node.tag) && !match[4])
        {
            stack.push(node);
        }
    };

    this.close = (match) =>
    {
        const name = match[1].toLowerCase();

        if(stack.length && stack[stack.length - 1].tag === name)
        {
            return stack.pop();
        }

        errors.push({
            line: this.line(match.index),
            message: 'The tag ' + name + ' closes without opening, the markup nests cleanly.'
        });
    };

    this.moustache = (match) =>
    {
        expressions.push({
            code: match[5],
            line: this.line(match.index),
            scope: this.scope(),
            name: 'text'
        });
    };

    this.scan = () =>
    {
        for(let match; (match = token.exec(raw));)
        {
            this.read(match);
        }

        for(const left of stack)
        {
            errors.push({
                line: left.line,
                message: 'The tag ' + left.tag + ' never closes, the markup nests cleanly.'
            });
        }
    };

    this.read = (match) =>
    {
        if(match[1])
        {
            return this.close(match);
        }

        if(match[2])
        {
            return this.open(match);
        }

        if(match[5] !== undefined)
        {
            this.moustache(match);
        }
    };

    this.scan();

    return { roots, errors, expressions };
});
