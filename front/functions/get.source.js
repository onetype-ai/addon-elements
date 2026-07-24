// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

elements.Fn('get.source', function(render, callback)
{
    this.label = (option) =>
    {
        if(option.label)
        {
            return option.label;
        }

        if(option.title)
        {
            return option.title;
        }

        return option.name ? option.name : String(option.value);
    };

    this.entry = (option) =>
    {
        if(typeof option === 'object' && option !== null)
        {
            return {
                ...option,
                label: this.label(option)
            };
        }

        return {
            label: String(option),
            value: option
        };
    };

    this.refresh = () =>
    {
        if(render.State.ready && !render.State.rendering)
        {
            render.Update();
        }
    };

    this.remember = (list) =>
    {
        for(const option of list)
        {
            render.known[option.value] = option;
        }
    };

    this.results = (result) =>
    {
        return render.normalize(Array.isArray(result) ? result : []);
    };

    this.fetch = async (query) =>
    {
        render.loading = true;
        this.refresh();

        try
        {
            render.results = this.results(await callback().call(render, query ? query : '', 'search'));
            this.remember(render.results);
        }
        catch(error)
        {
            render.results = [];
            render.failure = error.message;
        }

        render.loading = false;
        this.refresh();
    };

    this.placehold = (values) =>
    {
        for(const value of values)
        {
            render.known[value] = {
                label: String(value),
                value
            };
        }
    };

    this.selected = async (missing) =>
    {
        try
        {
            this.remember(this.results(await callback().call(render, missing, 'selected')));
        }
        catch(error)
        {
            render.failure = error.message;
        }

        this.refresh();
    };

    render.normalize = (list) => list.map((option) => this.entry(option));
    render.sourced = typeof callback() === 'function';
    render.results = [];
    render.known = {};
    render.loading = false;

    if(!render.sourced)
    {
        return render;
    }

    render.search = onetype.HelperDebounce((query) => this.fetch(query), 300);

    render.resolve = async (values) =>
    {
        const missing = values.filter((value) => !(value in render.known));

        if(!missing.length)
        {
            return;
        }

        this.placehold(missing);
        await this.selected(missing);
    };

    render.find = (value) =>
    {
        return render.known[value] ? render.known[value] : render.results.find((option) => option.value === value);
    };

    render.OnInit(() => this.fetch(''));

    return render;
});
