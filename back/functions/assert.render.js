// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import elements from '#elements/back/addon.js';

elements.Fn('assert.render', function(file, render)
{
    const violations = [];

    this.report = (line, message) =>
    {
        violations.push({
            rule: 'element',
            file: file,
            line: line,
            message: message
        });
    };

    this.template = () =>
    {
        const returns = render.body.body.filter((node) => node.type === 'ReturnStatement');
        const argument = returns.length === 1 ? returns[0].argument : null;

        if(!argument || argument.type !== 'TemplateLiteral')
        {
            this.report(render.loc.start.line, 'The render returns exactly one template literal of pure html.');

            return null;
        }

        if(!argument.expressions.length)
        {
            return argument;
        }

        this.report(argument.expressions[0].loc.start.line, 'No ${} in the template, the markup stays pure html and the state binds through attributes.');

        return null;
    };

    this.inspect = (template) =>
    {
        const markup = this.Fn('get.markup', template.quasis[0].value.raw, template.loc.start.line);

        for(const error of markup.errors)
        {
            this.report(error.line, error.message);
        }

        if(markup.roots.length !== 1)
        {
            this.report(template.loc.start.line, 'The template holds exactly one root element, it found ' + markup.roots.length + '.');
        }

        markup.roots.forEach((root) => this.walk(root));

        return markup;
    };

    this.walk = (node) =>
    {
        this.Fn('assert.node', node, this.report);
        node.children.forEach((child) => this.walk(child));
    };

    const template = this.template();

    if(!template)
    {
        return { violations, markup: null };
    }

    return { violations, markup: this.inspect(template) };
});
