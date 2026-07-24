// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import elements from '#elements/back/addon.js';

elements.Fn('assert.bindings', function(file, expressions, render, config)
{
    const violations = [];
    const globals = [
        'true', 'false', 'null', 'undefined', 'in', 'typeof',
        'window', 'document', 'event',
        'Math', 'JSON', 'String', 'Number', 'Boolean', 'Array', 'Object', 'Date',
        'parseInt', 'parseFloat', 'isNaN'
    ];
    const known = new Set(globals.concat(config));

    this.walk = (node, visit) =>
    {
        if(!node || typeof node.type !== 'string')
        {
            return;
        }

        visit(node);

        Object.values(node).forEach((value) => this.branch(value, visit));
    };

    this.branch = (value, visit) =>
    {
        if(Array.isArray(value))
        {
            return value.forEach((child) => this.walk(child, visit));
        }

        if(value && typeof value === 'object')
        {
            this.walk(value, visit);
        }
    };

    this.assigns = (node) =>
    {
        if(node.type !== 'AssignmentExpression' || node.left.type !== 'MemberExpression')
        {
            return;
        }

        if(node.left.object.type === 'ThisExpression')
        {
            known.add(node.left.property.name);
        }
    };

    this.strange = (expression, match) =>
    {
        if(match[1] === '.' || match[2].startsWith('$'))
        {
            return false;
        }

        if(known.has(match[2]))
        {
            return false;
        }

        return !expression.scope.includes(match[2]);
    };

    this.writes = (expression, code) =>
    {
        if(!/(\+\+|--|(^|[^=!<>+\-*\/%&|^])=(?!=))/.test(code))
        {
            return;
        }

        violations.push({
            rule: 'element',
            file: file,
            line: expression.line,
            message: 'The binding ' + expression.name + ' assigns state inline, it does nothing there, the logic lives on this in the render.'
        });
    };

    this.shaped = (expression) =>
    {
        if(expression.name !== ':class' || !/^\s*\{/.test(expression.code))
        {
            return;
        }

        violations.push({
            rule: 'element',
            file: file,
            line: expression.line,
            message: 'The :class holds an object, that form does not exist, build one string: :class="\'card \' + (open ? \'on\' : \'\')".'
        });
    };

    this.inspect = (expression) =>
    {
        const code = expression.code.replace(/'[^']*'|"[^"]*"/g, '');

        this.shaped(expression);
        this.writes(expression, code);

        for(const match of code.matchAll(/(\.?)\b([A-Za-z_$][\w$]*)\b/g))
        {
            if(this.strange(expression, match))
            {
                violations.push({
                    rule: 'element',
                    file: file,
                    line: expression.line,
                    message: 'The binding ' + expression.name + ' reads ' + match[2] + ', the element defines it nowhere.'
                });
            }
        }
    };

    this.walk(render, (node) => this.assigns(node));

    expressions.forEach((expression) => this.inspect(expression));

    return violations;
});
