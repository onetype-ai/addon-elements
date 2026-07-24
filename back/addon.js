// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

const elements = onetype.Addon('elements', (addon) =>
{
    addon.Field('id', {
        type: 'string',
        description: 'Unique element id, dashes as the tag name, like post-card.'
    });

    addon.Field('addon', {
        type: 'string',
        value: '',
        description: 'The addon or package the element belongs to.'
    });

    addon.Field('icon', {
        type: 'string',
        value: 'extension',
        description: 'The material icon name of the element.'
    });

    addon.Field('name', {
        type: 'string',
        value: '',
        description: 'The name shown to whoever browses the elements.'
    });

    addon.Field('description', {
        type: 'string',
        value: '',
        description: 'What the element renders, one sentence.'
    });

    addon.Field('category', {
        type: 'string',
        value: '',
        description: 'The category the element files under.'
    });

    addon.Field('author', {
        type: 'string',
        value: '',
        description: 'Who made the element.'
    });

    addon.Field('collection', {
        type: 'string',
        value: '',
        description: 'The collection the element ships with.'
    });

    addon.Field('config', {
        type: 'json',
        value: {},
        description: 'Defines of the element properties, one define per property.'
    });

    addon.Field('metadata', {
        type: 'json',
        value: {},
        description: 'Free tags for whoever wants them.'
    });

    addon.Field('example', {
        type: 'array',
        value: [],
        each: {
            type: 'json',
            description: 'One example property set.'
        },
        description: 'Example property sets for previews.'
    });

    addon.Field('render', {
        type: 'function',
        description: 'Renders the element, assigns state onto this and returns the template.'
    });
});

export default elements;
