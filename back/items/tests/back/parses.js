// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.back', (tests) =>
{
    tests.Item({
        id: 'elements:back/parses',
        addon: 'elements',
        description: 'Reading markup answers the tags it holds, the classes they carry, the expressions inside them and the nesting that never closed.',
        callback: function({ assert })
        {
            this.elements = onetype.AddonGet('elements');

            this.read = (markup) =>
            {
                return this.elements.Fn('get.markup', markup, 1);
            };

            this.shaped = () =>
            {
                const parsed = this.read('<div class="card"><span>a</span></div>');

                assert.equal(parsed.roots.length, 1, 'one root reads as one');
                assert.equal(parsed.roots[0].tag, 'div', 'the tag is named');
                assert.equal(parsed.roots[0].classes.join(','), 'card', 'and the class it carries');
                assert.equal(parsed.roots[0].children.length, 1, 'the child stands under it');
                assert.equal(parsed.errors.length, 0, 'nothing is wrong with it');
            };

            this.many = () =>
            {
                const parsed = this.read('<div>a</div><p>b</p>');

                assert.equal(parsed.roots.length, 2, 'two roots read as two');
            };

            this.broken = () =>
            {
                const parsed = this.read('<div><span>a</div>');

                assert.truthy(parsed.errors.length > 0, 'a tag that never closes is reported');
                assert.match(parsed.errors[0].message, 'closes without opening', 'and the message says which way it broke');
            };

            this.expressions = () =>
            {
                const parsed = this.read('<div>{{ word }}</div>');

                assert.equal(parsed.expressions.length, 1, 'the expression is found');
                assert.match(parsed.expressions[0].code, 'word', 'and reads what it holds');
                assert.equal(parsed.expressions[0].name, 'text', 'named for where it sits');
                assert.equal(parsed.expressions[0].line, 1, 'on the line it was written');
            };

            this.void = () =>
            {
                const parsed = this.read('<img src="x">');

                assert.equal(parsed.roots.length, 1, 'a void tag stands alone');
                assert.equal(parsed.errors.length, 0, 'and closes nothing');
            };

            this.shaped();
            this.many();
            this.broken();
            this.expressions();
            this.void();
        }
    });
});
