// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import elements from '#elements/back/addon.js';

elements.Fn('get.styles', function(text)
{
    const rules = [];
    const errors = [];
    const keyframes = [];
    const clean = text
        .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '))
        .split('\n')
        .map((line) => /^\s*\/\//.test(line) ? '' : line)
        .join('\n');

    this.slashes = () =>
    {
        for(const [index, line] of text.split('\n').entries())
        {
            if(/^\s*\/\//.test(line))
            {
                errors.push({
                    line: index + 1,
                    message: 'A // line is not css, css knows no line comments and the banner lives only in the js file.'
                });
            }
        }
    };

    this.line = (index) =>
    {
        return clean.slice(0, index).split('\n').length;
    };

    this.step = (character, depth) =>
    {
        if(character === '{')
        {
            return depth + 1;
        }

        return character === '}' ? depth - 1 : depth;
    };

    this.block = (from) =>
    {
        let depth = 0;

        for(let index = from; index < clean.length; index++)
        {
            depth = this.step(clean[index], depth);

            if(clean[index] === '}' && !depth)
            {
                return index;
            }
        }

        return clean.length;
    };

    this.keep = (selector, opens, closes, start) =>
    {
        if(selector.startsWith('@media'))
        {
            return this.walk(opens + 1, closes);
        }

        if(selector.startsWith('@keyframes'))
        {
            return keyframes.push({
                name: selector.slice('@keyframes'.length).trim(),
                line: start
            });
        }

        if(selector.startsWith('@'))
        {
            return errors.push({
                line: start,
                message: 'Only @media lives here, ' + selector.split(/[\s({]/)[0] + ' goes.'
            });
        }

        rules.push({
            selector: selector,
            body: clean.slice(opens + 1, closes),
            line: start
        });
    };

    this.statements = (chunk, index) =>
    {
        const parts = chunk.split(';');

        for(const part of parts.slice(0, -1))
        {
            if(part.trim())
            {
                errors.push({
                    line: this.line(clean.indexOf(part.trim(), index)),
                    message: 'Only @media lives here, ' + part.trim().split(/[\s({]/)[0] + ' goes.'
                });
            }
        }

        return parts[parts.length - 1];
    };

    this.consume = (index, opens) =>
    {
        const selector = this.statements(clean.slice(index, opens), index).trim();
        const closes = this.block(opens);

        if(selector)
        {
            this.keep(selector, opens, closes, this.line(clean.indexOf(selector, index)));
        }

        return closes + 1;
    };

    this.walk = (from, until) =>
    {
        for(let index = from; index < until;)
        {
            const opens = clean.indexOf('{', index);

            if(opens === -1 || opens >= until)
            {
                return;
            }

            index = this.consume(index, opens);
        }
    };

    this.slashes();

    this.walk(0, clean.length);

    return { rules, errors, keyframes };
});
