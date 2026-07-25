// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.back', (tests) =>
{
    tests.Item({
        id: 'elements:back/styles',
        addon: 'elements',
        description: 'Reading a stylesheet answers every rule with the line it sits on, the keyframes it declares and whatever would not parse.',
        callback: function({ assert })
        {
            this.elements = onetype.AddonGet('elements');

            this.read = (text) =>
            {
                return this.elements.Fn('get.styles', text);
            };

            this.rules = () =>
            {
                const parsed = this.read('.one { color: red; }\n.two { margin: 0 }');

                assert.equal(parsed.rules.length, 2, 'two rules read as two');
                assert.equal(parsed.rules[0].selector, '.one', 'the selector is named');
                assert.match(parsed.rules[0].body, 'color: red', 'the body is carried');
                assert.equal(parsed.rules[1].line, 2, 'and the line it sits on is kept');
            };

            this.grouped = () =>
            {
                const parsed = this.read('.two, .three { margin: 0 }');

                assert.equal(parsed.rules.length, 1, 'a grouped selector is one rule');
                assert.equal(parsed.rules[0].selector, '.two, .three', 'carrying both names');
            };

            this.keyframes = () =>
            {
                const parsed = this.read('@keyframes spin { from { rotate: 0deg } to { rotate: 360deg } }');

                assert.equal(parsed.keyframes.length, 1, 'the keyframes are found');
                assert.equal(parsed.keyframes[0].name, 'spin', 'and named');
            };

            this.empty = () =>
            {
                const parsed = this.read('');

                assert.equal(parsed.rules.length, 0, 'nothing reads as no rules');
                assert.equal(parsed.errors.length, 0, 'and nothing wrong');
            };

            this.rules();
            this.grouped();
            this.keyframes();
            this.empty();
        }
    });
});
