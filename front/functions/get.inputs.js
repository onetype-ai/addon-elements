// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

elements.Fn('get.inputs', function(node, compile)
{
    this.camel = (name) =>
    {
        return name.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    };

    this.bound = (inputs, attribute) =>
    {
        try
        {
            inputs.data[this.camel(attribute.name.substring(1))] = onetype.Function(attribute.value, compile.data, false);
        }
        catch(error)
        {
            onetype.Error(400, '<:tag:> :attribute: failed: :reason:', {
                tag: node.tagName.toLowerCase(),
                attribute: attribute.name,
                reason: error.message
            });
        }
    };

    this.attribute = (inputs, attribute) =>
    {
        if(attribute.name.startsWith('#'))
        {
            inputs.wrapper[attribute.name.substring(1)] = attribute.value;

            return;
        }

        if(attribute.name.startsWith(':'))
        {
            return this.bound(inputs, attribute);
        }

        inputs.data[this.camel(attribute.name)] = attribute.value;
    };

    this.key = (inputs) =>
    {
        const key = inputs.wrapper['ot-key']
            || inputs.data['ot-key']
            || compile.key
            || compile.identifier;

        delete inputs.wrapper['ot-key'];
        delete inputs.data['ot-key'];

        return key;
    };

    const inputs = {
        data: {},
        wrapper: {},
        key: null
    };

    Array.from(node.attributes).forEach((attribute) => this.attribute(inputs, attribute));
    inputs.key = this.key(inputs);

    return inputs;
});
