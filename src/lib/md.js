const marked = require("marked");
const _ = require("lodash");

marked.setOptions({
  smartypants: true,
  headerIds: false,
  breaks: true,
});

const types = {
  standard: ["richtext"],
  inline: ["string"],
};

const getTargetFields = (attrs, cmpts) => {
  const result = {
    standard: _(attrs)
      .pickBy((v) => types.standard.includes(v.type))
      .keys()
      .value(),
    inline: _(attrs)
      .pickBy((v) => types.inline.includes(v.type))
      .keys()
      .value(),
    components: _(attrs)
      .pickBy((v) => v.type === "component")
      .mapValues((v) => {
        const attr = cmpts[v.component]?.attributes;
        if (!attr) throw new Error(`missing cmpt schema ${v.component}`);
        return attr;
      })
      .mapValues((attr) => getTargetFields(attr, cmpts))
      .value(),
  };
  return _.pickBy(result, (v) => _.keys(v).length > 0);
};

const mutateTransform = (fields, bodyAttrs) => {
  for (const key of fields?.standard ?? []) {
    if (!bodyAttrs[key]) continue;
    bodyAttrs[key] = marked.parse(bodyAttrs[key]);
  }
  for (const key of fields?.inline ?? []) {
    if (!bodyAttrs[key]) continue;
    bodyAttrs[key] = marked.parseInline(bodyAttrs[key]);
  }
  for (const key in fields?.components ?? {}) {
    const cmptFields = fields.components[key];
    if (!bodyAttrs[key]) continue;
    if (Array.isArray(bodyAttrs[key])) {
      bodyAttrs[key].forEach((attrs) => mutateTransform(cmptFields, attrs));
    } else {
      mutateTransform(cmptFields, bodyAttrs[key]);
    }
  }
};

class StrapiMarkdown {
  constructor(model, cmpts = {}) {
    if (!model?.attributes)
      throw new Error("`model` must be valid model object");
    if (!Array.isArray(types?.standard) || !Array.isArray(types?.inline))
      throw new Error(
        "`types` must be object containing `standard` and `inline` arrays"
      );
    const cmptsHaveAttrs = _(cmpts)
      .values()
      .map((v) => _.has(v, "attributes"))
      .every();
    if (!cmptsHaveAttrs) throw new Error("`cmpts` must be valid cmpt schema");

    this.targetFields = getTargetFields(model.attributes, cmpts);
  }

  parse = async (data) => {
    const { id, attributes } = await data;

    mutateTransform(this.targetFields, attributes);

    return { id, attributes };
  };

  md = (data) => {
    if (Array.isArray(data)) {
      return Promise.all(data.map((obj) => this.parse(obj)));
    } else {
      return this.parse(data);
    }
  };
}

module.exports = StrapiMarkdown;
