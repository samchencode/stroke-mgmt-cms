const marked = require("marked");

marked.setOptions({
  smartypants: true,
  headerIds: false,
  breaks: true,
})

const defaults = {
  types: {
    standard: ["richtext"],
    inline: ["string"],
  },
};

class StrapiMarkdown {
  constructor(model, types = defaults.types) {
    if (model && model.attributes) {
      this.model = model.attributes;
    } else {
      throw new Error("`model` must be valid model object");
    }

    if (
      types &&
      types.standard &&
      Array.isArray(types.standard) &&
      types.inline &&
      Array.isArray(types.inline)
    ) {
      this.types = types;
    } else {
      throw new Error(
        "`types` must be object containing `standard` and `inline` arrays"
      );
    }
  }

  parse = async (data) => {
    try {
      const { id, attributes } = await data;

      for (let key in this.model) {
        if (attributes[key]) {
          if (this.types.standard.includes(this.model[key].type)) {
            attributes[key] = marked.parse(attributes[key]);
          } else if (this.types.inline.includes(this.model[key].type)) {
            attributes[key] = marked.parseInline(attributes[key]);
          }
        }
      }
      return { id, attributes };
    } catch (err) {
      console.error(err);
    }
  };

  md = (data) => {
    try {
      if (Array.isArray(data)) {
        return Promise.all(data.map((obj) => this.parse(obj)));
      } else {
        return this.parse(data);
      }
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = StrapiMarkdown;
