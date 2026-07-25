// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.front', (tests) =>
{
    tests.Item({
        id: 'elements:front/renders',
        addon: 'elements',
        description: 'A registered element renders wherever its e- tag stands, taking its defaults from the config and its values from the attributes.',
        callback: async function({ mount, run, settle, assert })
        {
            this.declared = async () =>
            {
                await run(() =>
                {
                    onetype.AddonGet('elements').Item({
                        id: 'proof-card',
                        name: 'Card',
                        description: 'Renders what it was handed.',
                        config: {
                            title: {
                                type: 'string',
                                value: 'untitled',
                                description: 'A string, so a plain attribute proves it arrives.'
                            },
                            size: {
                                type: 'number',
                                value: 1,
                                description: 'A number, so a bound attribute proves its type.'
                            }
                        },
                        render: function()
                        {
                            return '<div class="card"><h1 class="title">{{ title }}</h1><span class="size">{{ size }}</span></div>';
                        }
                    });
                });
            };

            this.defaults = async () =>
            {
                await mount('<e-proof-card></e-proof-card>');

                settle();

                assert.text('.title', 'untitled', 'the string default stands');
                assert.text('.size', '1', 'and so does the number default');
            };

            this.given = async () =>
            {
                await mount('<e-proof-card title="handed"></e-proof-card>');

                settle();

                assert.text('.title', 'handed', 'a plain attribute reaches the render');
            };

            this.bound = async () =>
            {
                await mount('<e-proof-card :size="7"></e-proof-card>');

                settle();

                assert.text('.size', '7', 'a bound attribute reaches it typed');
            };

            this.scoped = async () =>
            {
                await mount('<e-proof-card></e-proof-card>');

                settle();

                assert.count('.card', 1, 'the element renders once');
                assert.attribute('.card', 'data-render', null, 'the markup it returns is its own');
            };

            await this.declared();
            await this.defaults();
            await this.given();
            await this.bound();
            await this.scoped();
        }
    });
});
