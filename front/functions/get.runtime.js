// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

elements.Fn('get.runtime', function()
{
    this.render = () =>
    {
        elements.Render('body', () =>
        {
            return document.body.outerHTML;
        });

        const render = elements.Render('body', window);
        document.body.replaceChildren(...render.Element.children);
    };

    if(document.readyState === 'loading')
    {
        document.addEventListener('DOMContentLoaded', () =>
        {
            this.render();
        });
    }
    else
    {
        this.render();
    }
});
