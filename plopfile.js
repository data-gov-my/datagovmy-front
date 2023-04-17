const inquirerRecursivePrompt = require("inquirer-recursive");

module.exports = function (
  /** @type {import('plop').NodePlopAPI} */
  plop
) {
  plop.setActionType("processSectionAnswers", (answer, config, plop) => {
    let sectionPartial = answer.sections.map(data => {
      return `<Section title="${data.section_name}" description="${data.section_description}"></Section>`;
    });
    sectionPartial = sectionPartial.join("\n");
    plop.setPartial("sectionPartial", sectionPartial);
  });
  plop.setPrompt("recursiveSectionPrompt", inquirerRecursivePrompt),
    // plop generator code
    plop.setGenerator("generate-dashboard", {
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
          path: "dashboards/{{dashCase dashboard_category}}/{{dashCase dashboard_name}}/index.tsx",
          templateFile: "plop-templates/dashboard-component.tsx.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: "pages/dashboard/{{dashCase dashboard_name}}/index.tsx",
          templateFile: "plop-templates/dashboard-page.tsx.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: "public/locales/en-GB/dashboard-{{dashCase dashboard_name}}.json",
          templateFile: "plop-templates/dashboard-translation.json.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: "public/locales/ms-MY/dashboard-{{dashCase dashboard_name}}.json",
          templateFile: "plop-templates/dashboard-translation.json.hbs",
          skipIfExists: true,
        },
      ],
    });
};
