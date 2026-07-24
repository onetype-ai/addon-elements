// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

elements.Fn('do.observe', function(render, item)
{
    this.watch = (node) =>
    {
        item.Get('visible') && onetype.ObserverVisible(node, () => item.Get('visible').call(render, node, item));
        item.Get('resize') && onetype.ObserverResize(node, () => item.Get('resize').call(render, node, item));
        item.Get('click') && onetype.ObserverClick(node, (click) => item.Get('click').call(render, click, node, item));
    };

    this.track = (node) =>
    {
        item.Get('scroll') && onetype.ObserverScroll(node, (scroll) => item.Get('scroll').call(render, scroll, node, item));
        item.Get('hover') && onetype.ObserverHover(node, (hover) => item.Get('hover').call(render, hover, node, item));
    };

    this.unobserve = (node) =>
    {
        onetype.ObserverUnvisible(node);
        onetype.ObserverUnresize(node);
        onetype.ObserverUnscroll(node);
        onetype.ObserverUnhover(node);
        onetype.ObserverUnclick(node);
    };

    this.release = (node) =>
    {
        const listener = onetype.emitters.catch('onetype.dom.remove', (removed) =>
        {
            if(removed !== node && document.contains(node))
            {
                return;
            }

            onetype.emitters.off('onetype.dom.remove', listener);
            this.unobserve(node);
            item.Get('destroy') && item.Get('destroy').call(render, node, item);
        });
    };

    this.wired = () =>
    {
        return ['visible', 'resize', 'click', 'scroll', 'hover', 'destroy'].some((name) => item.Get(name));
    };

    this.start = () =>
    {
        const node = render.Element;

        this.watch(node);
        this.track(node);
        this.release(node);
    };

    if(!this.wired())
    {
        return;
    }

    render.OnMounted(() => this.start());
});
