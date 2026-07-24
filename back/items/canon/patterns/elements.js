// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('canon.patterns', (patterns) =>
{
    patterns.Item({
        id: 'elements:elements',
        description: 'An element file wraps one elements.Item in AddonReady, the addon owns it and the id is the tag without the e- prefix.',
        match: '/items/elements/[^/]+(?:/[^/]+)?\\.js$',
        claims: '/items/elements/',
        pattern: 'onetype.AddonReady(\'elements\', (elements) =>\n{\n    elements.Item({ __fields__ });\n});',
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
            collection: {
                type: 'string',
                description: 'Collection the element ships with.'
            },
            metadata: {
                type: 'object',
                description: 'Free tags for whoever wants them.'
            },
            config: {
                type: 'object',
                description: 'Define of the properties the element accepts.'
            },
            render: {
                type: 'function',
                required: true,
                description: 'The element body, returns the markup and binds its state.'
            }
        }
    });
});
