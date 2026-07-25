// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.back', (tests) =>
{
    tests.Item({
        id: 'elements:back/claims',
        addon: 'elements',
        description: 'The addon hands canon the shape an element file takes, the folder it lives in and the stylesheet beside it.',
        callback: function({ assert })
        {
            this.pattern = () =>
            {
                const patterns = onetype.AddonGet('canon.patterns');

                if(!patterns)
                {
                    return;
                }

                const claimed = patterns.ItemGet('elements:elements');

                assert.truthy(claimed, 'the elements pattern stands');
                assert.match(claimed.Get('claims'), '/items/elements/', 'claiming the folder elements live in');
                assert.match(claimed.Get('pattern'), 'elements.Item', 'and naming the call it expects');
                assert.equal(typeof claimed.Get('assert'), 'function', 'with a check of its own beyond the shape');
            };

            this.placement = () =>
            {
                const placements = onetype.AddonGet('canon.placements');

                if(!placements)
                {
                    return;
                }

                const placed = placements.ItemGet('elements:elements');

                assert.truthy(placed, 'the elements placement stands');
                assert.equal(placed.Get('receiver'), 'elements', 'riding the receiver it names');
                assert.match(placed.Get('home'), '/items/elements/', 'and allowing the one home');
            };

            this.tree = () =>
            {
                const tree = onetype.AddonGet('canon.tree');

                if(!tree)
                {
                    return;
                }

                const paths = Object.values(tree.Items()).map((entry) => entry.Get('path'));

                assert.truthy(paths.includes('front/items/elements/**.js'), 'the tree allows the element itself');
                assert.truthy(paths.includes('front/items/elements/**.css'), 'and the stylesheet beside it');
            };

            this.asset = () =>
            {
                const shipped = Object.values(onetype.assets.Items()).filter((entry) => entry.Get('addon') === 'elements');

                assert.equal(shipped.length, 1, 'assets carries the elements front once');
                assert.truthy(shipped[0].Get('js'), 'and the folder it hands over');
            };

            this.pattern();
            this.placement();
            this.tree();
            this.asset();
        }
    });
});
