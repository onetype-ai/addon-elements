// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import elements from '#elements/back/addon.js';

elements.Fn('assert.selector', function(selector, context)
{
    const { hash, root, rule, report, mentioned } = context;

    this.shape = () =>
    {
        if(/[+~]/.test(selector))
        {
            return 'The selector ' + selector + ' combines with + or ~, only > walks the structure.';
        }

        const steps = selector.split('>').map((step) => step.trim());

        if(steps.some((step) => /\s/.test(step)))
        {
            return 'The selector ' + selector + ' descends with a space, only > walks the structure.';
        }

        return this.steps(steps);
    };

    this.steps = (steps) =>
    {
        for(const step of steps)
        {
            if(/#/.test(step))
            {
                return 'The selector ' + selector + ' points at an id, classes only.';
            }

            if(/^[a-zA-Z*]/.test(step))
            {
                return 'The selector ' + selector + ' opens a step with a tag, every step opens with a class.';
            }
        }

        return null;
    };

    this.chain = () =>
    {
        return selector.split('>').map((step) =>
        {
            const found = [...step.matchAll(/\.([\w-]+)/g)].map((match) => match[1]);

            found.forEach((name) => mentioned.add(name));

            return found;
        });
    };

    this.exists = (node, chain, index) =>
    {
        if(index === chain.length)
        {
            return true;
        }

        return node.children.some((child) => this.matches(child, chain, index));
    };

    this.matches = (child, chain, index) =>
    {
        if(!child.dynamic && !chain[index].every((name) => child.classes.includes(name)))
        {
            return false;
        }

        return this.exists(child, chain, index + 1);
    };

    this.check = () =>
    {
        const broken = this.shape();

        if(broken)
        {
            return report(rule.line, broken);
        }

        const chain = this.chain();

        if(!chain[0].includes(hash))
        {
            return report(rule.line, 'The selector ' + selector + ' does not open with .' + hash + ', the hash of this element scopes every rule.');
        }

        if(root && !this.exists(root, chain, 1))
        {
            report(rule.line, 'The selector ' + selector + ' walks a structure the template does not build.');
        }
    };

    this.check();
});
