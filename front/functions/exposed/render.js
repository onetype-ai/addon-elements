// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

elements.FnExpose('render', function(name, data = {}, attributes = {}, slots = {})
{
    return elements.Render(name, data, attributes, slots);
}, 'Renders a registered element from code and answers the live render instance.');
