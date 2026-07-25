// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.back', (tests) =>
{
    tests.Item({
        id: 'elements:back/scopes',
        addon: 'elements',
        description: 'Every rule in an element stylesheet opens on the hash of that element and walks only the structure its own template builds.',
        callback: function({ assert })
        {
            this.elements = onetype.AddonGet('elements');

            this.child = () =>
            {
                return {
                    tag: 'div',
                    classes: ['card'],
                    children: []
                };
            };

            this.root = () =>
            {
                return {
                    tag: 'div',
                    classes: ['e-abc'],
                    children: [this.child()]
                };
            };

            this.check = (selector, root) =>
            {
                const broken = [];

                this.elements.Fn('assert.selector', selector, {
                    hash: 'e-abc',
                    root: root,
                    rule: {
                        line: 1,
                        selector: selector
                    },
                    report: (line, message) =>
                    {
                        broken.push(message);
                    },
                    mentioned: new Set()
                });

                return broken;
            };

            this.scoped = () =>
            {
                const loose = this.check('.card', null);

                assert.equal(loose.length, 1, 'a rule that does not open on the hash is refused');
                assert.match(loose[0], 'does not open with .e-abc', 'and the message names the hash it wanted');
            };

            this.walking = () =>
            {
                const spaced = this.check('.e-abc .card', this.root());

                assert.equal(spaced.length, 1, 'a descendant space is refused');
                assert.match(spaced[0], 'only > walks the structure', 'the child combinator being the one way down');
            };

            this.built = () =>
            {
                const held = this.check('.e-abc > .card', this.root());
                const absent = this.check('.e-abc > .nowhere', this.root());

                assert.equal(held.length, 0, 'a rule walking what the template builds is held');
                assert.equal(absent.length, 1, 'and one walking what it does not is refused');
            };

            this.scoped();
            this.walking();
            this.built();
        }
    });
});
