// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import { existsSync, readFileSync } from 'fs';
import elements from '#elements/back/addon.js';

elements.Fn('assert.canon', function(context)
{
    const violations = [];

    this.field = (name) =>
    {
        const property = context.fields.find((entry) => name === (entry.key.name ? entry.key.name : entry.key.value));

        return property ? property.value : null;
    };

    this.properties = () =>
    {
        const config = this.field('config');

        if(!config || config.type !== 'ObjectExpression')
        {
            return [];
        }

        return config.properties.map((entry) => entry.key.name ? entry.key.name : entry.key.value);
    };

    this.styles = (identifier, markup) =>
    {
        const sibling = context.file.replace(/\.js$/, '.css');

        if(!existsSync(sibling))
        {
            return;
        }

        const hash = 'e-' + onetype.GenerateHash('elements-' + identifier);
        const styles = this.Fn('get.styles', readFileSync(sibling, 'utf8'));

        for(const error of styles.errors)
        {
            violations.push({
                rule: 'element',
                file: sibling,
                line: error.line,
                message: error.message
            });
        }

        const wrapper = {
            classes: [],
            dynamic: true,
            children: markup.roots,
            line: 1
        };

        const pair = {
            js: context.file,
            css: sibling
        };

        violations.push(...this.Fn('assert.styles', pair, styles, hash, wrapper));
    };

    this.check = () =>
    {
        const identifier = this.field('id');
        const render = this.field('render');

        if(!identifier || identifier.type !== 'Literal' || !render)
        {
            return;
        }

        const result = this.Fn('assert.render', context.file, render);

        violations.push(...result.violations);

        if(!result.markup)
        {
            return;
        }

        violations.push(...this.Fn('assert.bindings', context.file, result.markup.expressions, render, this.properties()));

        this.styles(identifier.value, result.markup);
    };

    this.check();

    return violations;
});
