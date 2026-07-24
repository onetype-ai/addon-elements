// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

elements.ItemOn('add', (item) =>
{
    elements.RenderAdd(item.Get('id'), function()
    {
        this.Define(item.Get('config'));

        return item.Get('render').call(this);
    });
})
