// plopfile.js
module.exports = function (
  /** @type {import('plop').NodePlopAPI} */
  plop
) {
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
    ],
    actions: [
      {
        type: "add",
        path: "dashboards/{{dashCase dashboard_category}}/{{dashCase dashboard_name}}/index.tsx",
        templateFile: "plop-templates/dashboard-component.tsx.hbs",
      },
      {
        type: "add",
        path: "pages/dashboard/{{dashCase dashboard_name}}/index.tsx",
        templateFile: "plop-templates/dashboard-page.tsx.hbs",
      },
      {
        type: "add",
        path: "public/locales/en-GB/dashboard-{{dashCase dashboard_name}}.json",
        templateFile: "plop-templates/dashboard-translation.json.hbs",
      },
      {
        type: "add",
        path: "public/locales/ms-MY/dashboard-{{dashCase dashboard_name}}.json",
        templateFile: "plop-templates/dashboard-translation.json.hbs",
      },
    ],
  });
};
