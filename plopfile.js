const path = require("path");
const fs = require("fs");
const inquirerRecursivePrompt = require("inquirer-recursive");
const dashcase = require("lodash/kebabCase");
const titlecase = require("lodash/startCase");

const app_dir = path.resolve(__dirname, "apps/app");
const docs_dir = path.resolve(__dirname, "apps/docs");
const tests_dir = path.resolve(__dirname, "tests");

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
    ],
  });

  /**
   * Test Generator.
   * Command: yarn plop tests
   */

  plop.setActionType("prepStateDashboard", (answer, config, plop) => {
    if (!answer.test_dashboard_with_states) {
      plop.setPartial("states_tests", "");
      return;
    }

    let states_tests = answer.test_dashboard_states.map(state => {
      return `test("${answer.test_name}/${state}", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/${answer.test_name}/${state}");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});`;
    });
    plop.setPartial("states_tests", states_tests.join("\n\n"));
  });

  plop.setGenerator("tests", {
    description: "Add a test",
    prompts: [
      {
        type: "list",
        name: "test_project",
        message: "Test for project?",
        choices: [
          { name: "app", value: "app" },
          { name: "opendosm", value: "opendosm" },
        ],
        default: "app",
      },
      {
        type: "list",
        name: "test_category",
        message: "Category of test?",
        choices: [
          { name: "dashboard", value: "dashboard" },
          { name: "data-catalogue", value: "data-catalogue" },
        ],
        default: "dashboard",
      },
      {
        when: answers => answers.test_category === "dashboard",
        type: "input",
        name: "test_name",
        message: "Dashboard identifier? (dash-case)",
        validate: value => value && value.length > 0,
      },
      {
        when: answers => answers.test_category === "data-catalogue",
        type: "input",
        name: "test_name",
        message: "Catalogue identifier?",
        default: "dgmy-public-mwe_mwe_hbar_4_0",
      },
      {
        when: answers => answers.test_category === "dashboard",
        type: "confirm",
        name: "test_dashboard_with_states",
        message: "Does the dashboard comes with individual states? (eg. kul, jhr)",
        default: false,
      },
      {
        when: answers => answers.test_dashboard_with_states,
        type: "checkbox",
        name: "test_dashboard_states",
        message: "Choose the relevant states:",
        choices: [
          { name: "Johor", value: "jhr", checked: true },
          { name: "Kedah", value: "kdh", checked: true },
          { name: "Kelantan", value: "ktn", checked: true },
          { name: "Melaka", value: "mlk", checked: true },
          { name: "Negeri Sembilan", value: "nsn", checked: true },
          { name: "Pahang", value: "phg", checked: true },
          { name: "Perak", value: "prk", checked: true },
          { name: "Perlis", value: "pls", checked: true },
          { name: "Pulau Pinang", value: "png", checked: true },
          { name: "Sabah", value: "sbh", checked: true },
          { name: "Sarawak", value: "swk", checked: true },
          { name: "Selangor", value: "sgr", checked: true },
          { name: "Terengganu", value: "trg", checked: true },
          { name: "W.P. Kuala Lumpur", value: "kul", checked: true },
          { name: "W.P. Labuan", value: "lbn", checked: true },
          { name: "W.P. Putrajaya", value: "pjy", checked: true },
        ],
      },
    ],
    actions: [
      {
        type: "prepStateDashboard",
      },
      {
        type: "add",
        path: path.join(
          tests_dir,
          "{{ test_project }}-tests/tests/{{ test_category }}",
          "{{ dashCase test_name }}.spec.ts"
        ),
        templateFile: path.join(tests_dir, "utils/templates/{{ test_category }}-spec.hbs"),
        skipIfExists: true,
      },
    ],
  });
};
