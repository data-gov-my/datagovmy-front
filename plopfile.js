const path = require("path");
const inquirerRecursivePrompt = require("inquirer-recursive");

const app_dir = path.resolve(__dirname, "apps/app");
const docs_dir = path.resolve(__dirname, "apps/docs");
// const i18n_dir = path.resolve(__dirname, "packages/i18n");

module.exports = plop => {
  // plop.setActionType("processSectionAnswers", (answer, config, plop) => {
  //   let sectionPartial = answer.sections.map(data => {
  //     return `<Section title="${data.section_name}" description="${data.section_description}"></Section>`;
  //   });
  //   sectionPartial = sectionPartial.join("\n");
  //   plop.setPartial("sectionPartial", sectionPartial);
  // });
  plop.setPrompt("recursiveSectionPrompt", inquirerRecursivePrompt);

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
        message: "File path? (relative to /pages",
      },
    ],
    actions: [
      {
        type: "add",
        path: path.join(docs_dir, "pages/{{ docs_path }}", "{{dashCase docs_name}}.en.mdx"),
        templateFile: path.join(docs_dir, "templates/docs-page.mdx.hbs"),
        skipIfExists: true,
      },
      {
        type: "add",
        path: path.join(docs_dir, "pages/{{ docs_path }}", "{{dashCase docs_name}}.ms.mdx"),
        templateFile: path.join(docs_dir, "templates/docs-page.mdx.hbs"),
        skipIfExists: true,
      },
    ],
  });

  // plop generator code
  // plop.setGenerator("generate-dashboard", {
  //   description: "Initialise dashboard file based on the input",
  //   prompts: [
  //     {
  //       type: "input",
  //       name: "dashboard_name",
  //       message: "Input dashboard name (e.g. blood donation)",
  //     },
  //     {
  //       type: "input",
  //       name: "dashboard_category",
  //       message: "Input dashboard category (e.g. healthcare)",
  //     },
  //     {
  //       type: "input",
  //       name: "agency_name",
  //       message: "Input agency name (e.g. MAMPU)",
  //     },
  //     {
  //       type: "input",
  //       name: "agency_link",
  //       message: "Input agency link (e.g. https://mampu.com)",
  //     },
  //     {
  //       type: "recursiveSectionPrompt",
  //       name: "sections",
  //       message: "Add a new section?",
  //       prompts: [
  //         {
  //           type: "input",
  //           name: "section_name",
  //           message: "Input section name (e.g. How do blood donor rates differ?)",
  //         },
  //         {
  //           type: "input",
  //           name: "section_description",
  //           message: "Input section description (e.g. This data shows the % of...)",
  //         },
  //       ],
  //     },
  //   ],
  //   actions: [
  //     {
  //       type: "processSectionAnswers",
  //     },
  //     {
  //       type: "add",
  //       path: path.join(
  //         app_dir,
  //         "dashboards/{{dashCase dashboard_category}}/{{dashCase dashboard_name}}/index.tsx"
  //       ),
  //       templateFile: path.join(app_dir, "templates/dashboard-component.tsx.hbs"),
  //       skipIfExists: true,
  //     },
  //     {
  //       type: "add",
  //       path: path.join(app_dir, "pages/dashboard/{{dashCase dashboard_name}}/index.tsx"),
  //       templateFile: path.join(app_dir, "templates/dashboard-page.tsx.hbs"),
  //       skipIfExists: true,
  //     },
  //     // Note: i18n is moved to datagovmy-meta repo.
  //     // {
  //     //   type: "add",
  //     //   path: path.join(i18n_dir, "en-GB/dashboard-{{dashCase dashboard_name}}.json"),
  //     //   templateFile: path.join(app_dir, "templates/dashboard-translation.json.hbs"),
  //     //   skipIfExists: true,
  //     // },
  //     // {
  //     //   type: "add",
  //     //   path: path.join(i18n_dir, "ms-MY/dashboard-{{dashCase dashboard_name}}.json"),
  //     //   templateFile: path.join(app_dir, "templates/dashboard-translation.json.hbs"),
  //     //   skipIfExists: true,
  //     // },
  //   ],
  // });
};
