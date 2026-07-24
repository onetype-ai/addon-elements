// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('canon.tree', (tree) =>
{
    tree.Item({
        id: 'elements.style',
        path: 'front/items/elements/**.css',
        pair: 'js',
        description: 'The stylesheet of an element, it rides beside the registration of the same name.'
    });
});
