// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import elements from '#elements/back/addon.js';

onetype.AddonReady('canon.patterns', (patterns) =>
{
    patterns.Item({
        id: 'elements:elements',
        description: 'An element file wraps one elements.Item in AddonReady, the addon owns it and the id is the tag without the e- prefix.',
        match: '/items/elements/[^/]+(?:/[^/]+)?\\.js$',
        claims: '/items/elements/',
        pattern: 'onetype.AddonReady(\'elements\', (elements) =>\n{\n    elements.Item({ __fields__ });\n});',
        assert: (context) =>
        {
            return elements.Fn('assert.canon', context);
        },
        fields: {
            id: {
                type: 'string',
                required: true,
                description: 'The element id, the tag without the e- prefix.'
            },
            addon: {
                type: 'string',
                required: true,
                description: 'The addon the element belongs to, its owner.'
            },
            icon: {
                type: 'string',
                description: 'The material icon name of the element.'
            },
            name: {
                type: 'string',
                required: true,
                description: 'Human name of the element.'
            },
            description: {
                type: 'string',
                required: true,
                description: 'What the element renders, one sentence.'
            },
            config: {
                type: 'object',
                description: 'Defines of the element properties, one define per property.'
            },
            metadata: {
                type: 'object',
                description: 'Free tags for whoever wants them.'
            },
            example: {
                type: 'array',
                description: 'Example property sets for previews.'
            },
            render: {
                type: 'function',
                required: true,
                description: 'The element body, returns the markup and binds its state.'
            },
            visible: {
                type: 'function',
                description: 'Runs when the element enters or leaves the viewport, left out when unused.'
            },
            resize: {
                type: 'function',
                description: 'Runs when the element resizes, left out when unused.'
            },
            click: {
                type: 'function',
                description: 'Runs when the element is clicked, left out when unused.'
            },
            scroll: {
                type: 'function',
                description: 'Runs as the element scrolls through the viewport, left out when unused.'
            },
            hover: {
                type: 'function',
                description: 'Runs as the pointer moves over the element, left out when unused.'
            },
            destroy: {
                type: 'function',
                description: 'Runs when the element leaves the document, left out when unused.'
            }
        }
    });
});
