// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.back', (tests) =>
{
    tests.Item({
        id: 'elements:back/binds',
        addon: 'elements',
        description: 'An element is held to its own config, so a binding reaching for something the element never defined is caught before it ever renders.',
        callback: function({ assert })
        {
            this.canon = onetype.AddonGet('canon');
            this.here = new URL('.', import.meta.url).pathname;

            this.defined = () =>
            {
                const answered = this.canon.violations(new URL('binds.js', import.meta.url).pathname);

                assert.equal(answered.length, 0, 'this file obeys the canon it reaches for');
            };

            this.hooked = () =>
            {
                const patterns = onetype.AddonGet('canon.patterns');
                const claimed = patterns ? patterns.ItemGet('elements:elements') : null;

                assert.truthy(claimed, 'the element pattern carries the check');
                assert.equal(typeof claimed.Get('assert'), 'function', 'and it is a function canon calls');
            };

            this.reading = () =>
            {
                const parsed = onetype.AddonGet('elements').Fn('get.markup', '<div>{{ nowhere }}</div>', 1);

                assert.equal(parsed.expressions.length, 1, 'the binding is found in the markup');
                assert.match(parsed.expressions[0].code, 'nowhere', 'naming what it reaches for');
            };

            this.defined();
            this.hooked();
            this.reading();
        }
    });
});
