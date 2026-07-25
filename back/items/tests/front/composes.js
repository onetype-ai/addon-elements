// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.front', (tests) =>
{
    tests.Item({
        id: 'elements:front/composes',
        addon: 'elements',
        description: 'Elements nest inside each other, take content through their slots and multiply over a list, each row keyed and holding its own data.',
        callback: async function({ mount, run, settle, assert })
        {
            this.declared = async () =>
            {
                await run(() =>
                {
                    const elements = onetype.AddonGet('elements');

                    elements.Item({
                        id: 'proof-frame',
                        name: 'Frame',
                        description: 'Holds whatever is handed to it.',
                        config: {},
                        render: function()
                        {
                            return '<div class="frame"><slot name="body"></slot></div>';
                        }
                    });

                    elements.Item({
                        id: 'proof-row',
                        name: 'Row',
                        description: 'One row of a list.',
                        config: {
                            word: {
                                type: 'string',
                                value: '',
                                description: 'What the row reads.'
                            }
                        },
                        render: function()
                        {
                            return '<li class="row">{{ word }}</li>';
                        }
                    });
                });
            };

            this.slotted = async () =>
            {
                await mount('<e-proof-frame><p slot="body" class="held">handed over</p></e-proof-frame>');

                settle();

                assert.exists('.frame', 'the frame renders');
                assert.text('.held', 'handed over', 'and the slot carries what was put in it');
            };

            this.nested = async () =>
            {
                await mount('<e-proof-frame><e-proof-row slot="body" :word="\'inside\'"></e-proof-row></e-proof-frame>');

                settle();

                assert.exists('.frame', 'the outer element renders');
                assert.text('.row', 'inside', 'and the inner one renders within it');
            };

            this.listed = async () =>
            {
                await mount('<ul><e-proof-row ot-for="entry in words" :word="entry" ot-key="entry"></e-proof-row></ul>', {
                    words: ['one', 'two', 'three']
                });

                settle();

                assert.count('.row', 3, 'the element multiplies over the list');
                assert.text('.row', 'one', 'the first row holding its own word');
            };

            this.emptied = async () =>
            {
                await mount('<ul><e-proof-row ot-for="entry in words" :word="entry"></e-proof-row></ul>', { words: [] });

                settle();

                assert.count('.row', 0, 'a list of nothing renders nothing');
            };

            await this.declared();
            await this.slotted();
            await this.nested();
            await this.listed();
            await this.emptied();
        }
    });
});
