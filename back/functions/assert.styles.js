// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import elements from '#elements/back/addon.js';

elements.Fn('assert.styles', function(files, styles, hash, wrapper)
{
    const violations = [];
    const mentioned = new Set();

    this.report = (file, line, message) =>
    {
        violations.push({
            rule: 'element',
            file: file,
            line: line,
            message: message
        });
    };

    this.frames = () =>
    {
        for(const frame of styles.keyframes)
        {
            if(!frame.name.startsWith(hash + '-'))
            {
                const lawful = hash + '-' + frame.name;

                this.report(files.css, frame.line, 'The keyframes ' + frame.name + ' float free, animation names open with the hash, ' + lawful + '.');
            }
        }
    };

    this.rule = (rule) =>
    {
        if(rule.body.includes('!important'))
        {
            this.report(files.css, rule.line, 'No !important, the cascade stays flat because every selector starts from the hash.');
        }

        for(const selector of rule.selector.split(','))
        {
            this.Fn('assert.selector', selector.trim(), {
                hash: hash,
                root: wrapper,
                rule: rule,
                report: (line, message) =>
                {
                    this.report(files.css, line, message);
                },
                mentioned: mentioned
            });
        }
    };

    this.orphans = (node) =>
    {
        for(const name of node.classes)
        {
            if(!mentioned.has(name))
            {
                this.report(files.js, node.line, 'The class ' + name + ' never appears in the css beside, it goes or it gets its look.');
            }
        }

        node.children.forEach((child) => this.orphans(child));
    };

    this.frames();

    styles.rules.forEach((rule) => this.rule(rule));

    this.orphans(wrapper);

    return violations;
});
