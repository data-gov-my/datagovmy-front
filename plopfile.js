const path = require("path");
const fs = require("fs");
const inquirerRecursivePrompt = require("inquirer-recursive");
const dashcase = require("lodash/kebabCase");
const titlecase = require("lodash/startCase");

const app_dir = path.resolve(__dirname, "apps/app");
const docs_dir = path.resolve(__dirname, "apps/docs");
// const i18n_dir = path.resolve(__dirname, "packages/i18n");

const updateMeta = (props, lang) => {
  const dir = path.join(docs_dir, "pages", props.docs_path, `_meta.${lang}.json`);
  const name = props.docs_name;
  const pathd = props.docs_path;
  if (!fs.existsSync(dir)) return "File does not exist. Make sure the previous actions are correct";

  const meta = fs.readFileSync(path.join(docs_dir, "pages", pathd, `_meta.${lang}.json`), {
    encoding: "utf-8",
  });

  if (!meta) return "File undefined";
  if (meta.includes(name.replace(/[A-Z]/g, "-$&").toLowerCase()))
    return "Page meta updated. Skipping...";

  const final = JSON.parse(meta);
  Object.assign(final, { [dashcase(name)]: titlecase(name) });

  fs.writeFile(dir, JSON.stringify(final, null, 4), () => {});

  return `_meta.${lang}.json successfully updated. Output: ${dir}`;
};

module.exports = plop => {
  plop.setPrompt("recursiveSectionPrompt", inquirerRecursivePrompt);

  /**
   * Docs Generator.
   * Command: yarn plop docs
   */
  plop.setGenerator("docs", {
    description: "Add a docs page",
    prompts: [
      {
        type: "input",
        name: "docs_name",
        message: "Title of docs page?",
      },
      {
        type: "input",
        name: "docs_path",
        message: "File path? -> /pages/",
        validate: value => {
          return fs.existsSync(path.join(docs_dir, "pages", value))
            ? true
            : "Directory does not exist";
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: path.join(docs_dir, "pages/{{ docs_path }}", "_meta.en.json"),
        templateFile: path.join(docs_dir, "templates/_meta.json.hbs"),
        skipIfExists: true,
      },
      {
        type: "add",
        path: path.join(docs_dir, "pages/{{ docs_path }}", "_meta.ms.json"),
        templateFile: path.join(docs_dir, "templates/_meta.json.hbs"),
        skipIfExists: true,
      },
      props => updateMeta(props, "en"),
      props => updateMeta(props, "ms"),
      {
        type: "add",
        path: path.join(docs_dir, "pages/{{ docs_path }}", "{{dashCase docs_name}}.en.mdx"),
        templateFile: path.join(docs_dir, "templates/docs.mdx.hbs"),
        skipIfExists: true,
      },
      {
        type: "add",
        path: path.join(docs_dir, "pages/{{ docs_path }}", "{{dashCase docs_name}}.ms.mdx"),
        templateFile: path.join(docs_dir, "templates/docs.mdx.hbs"),
        skipIfExists: true,
      },
    ],
  });

  /**
   * Dashboard Generator
   * Command: yarn plop dashboard
   */
  plop.setActionType("processSectionAnswers", (answer, config, plop) => {
    let sectionPartial = answer.sections.map(data => {
      return `<Section title="${data.section_name}" description="${data.section_description}"></Section>`;
    });
    sectionPartial = sectionPartial.join("\n");
    plop.setPartial("sectionPartial", sectionPartial);
  });

  plop.setGenerator("dashboard", {
    description: "Initialise dashboard file based on the input",
    prompts: [
      {
        type: "input",
        name: "dashboard_name",
        message: "Input dashboard name (e.g. blood donation)",
      },
      {
        type: "input",
        name: "dashboard_category",
        message: "Input dashboard category (e.g. healthcare)",
      },
      {
        type: "input",
        name: "agency_name",
        message: "Input agency name (e.g. MAMPU)",
      },
      {
        type: "input",
        name: "agency_link",
        message: "Input agency link (e.g. https://mampu.com)",
      },
      {
        type: "recursiveSectionPrompt",
        name: "sections",
        message: "Add a new section?",
        prompts: [
          {
            type: "input",
            name: "section_name",
            message: "Input section name (e.g. How do blood donor rates differ?)",
          },
          {
            type: "input",
            name: "section_description",
            message: "Input section description (e.g. This data shows the % of...)",
          },
        ],
      },
    ],
    actions: [
      {
        type: "processSectionAnswers",
      },
      {
        type: "add",
        path: path.join(
          app_dir,
          "dashboards/{{dashCase dashboard_category}}/{{dashCase dashboard_name}}/index.tsx"
        ),
        templateFile: path.join(app_dir, "templates/dashboard-component.tsx.hbs"),
        skipIfExists: true,
      },
      {
        type: "add",
        path: path.join(app_dir, "pages/dashboard/{{dashCase dashboard_name}}/index.tsx"),
        templateFile: path.join(app_dir, "templates/dashboard-page.tsx.hbs"),
        skipIfExists: true,
      },
      // Note: i18n is moved to datagovmy-meta repo.
      // {
      //   type: "add",
      //   path: path.join(i18n_dir, "en-GB/dashboard-{{dashCase dashboard_name}}.json"),
      //   templateFile: path.join(app_dir, "templates/dashboard-translation.json.hbs"),
      //   skipIfExists: true,
      // },
      // {
      //   type: "add",
      //   path: path.join(i18n_dir, "ms-MY/dashboard-{{dashCase dashboard_name}}.json"),
      //   templateFile: path.join(app_dir, "templates/dashboard-translation.json.hbs"),
      //   skipIfExists: true,
      // },
    ],
  });
};
