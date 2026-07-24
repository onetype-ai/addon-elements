// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('canon.placements', (placements) =>
{
    placements.Item({
        id: 'elements:elements',
        method: 'Item',
        receiver: 'elements',
        home: '/items/elements/',
        description: 'An element is a front surface, it stands alone in items elements.'
    });
});
