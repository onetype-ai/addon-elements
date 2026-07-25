// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

elements.FnExpose('mount', function()
{
    this.body = () =>
    {
        elements.Render('body', () =>
        {
            return document.body.outerHTML;
        });

        const render = elements.Render('body', window);

        document.body.replaceChildren(...render.Element.children);

        return render;
    };

    if(document.readyState !== 'loading')
    {
        return this.body();
    }

    document.addEventListener('DOMContentLoaded', () => this.body());

    return null;
});
