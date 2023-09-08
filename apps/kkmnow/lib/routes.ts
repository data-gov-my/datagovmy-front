export const routes = {
  COVID_19: "/dashboard/covid-19",
  COVID_VACCINATION: "/dashboard/covid-vaccination",
  BLOOD_DONATION: "/dashboard/blood-donation",
  ORGAN_DONATION: "/dashboard/organ-donation",
  PEKA_B40: "/dashboard/peka-b40",
  FACILITIES: "/dashboard/healthcare-facilities",
  HOSPITAL_BED_UTILISATION: "/dashboard/hospital-bed-utilisation",
  COVIDNOW_DATA: "/dashboard/covidnow-data",
};

export const static_routes: string[] = (() => {
  let s_routes = Object.values(routes).filter(route => !["/data-catalogue"].includes(route));

  s_routes.forEach(route => {
    s_routes.push(`/ms-MY${route}`);
  });
  return s_routes;
})();
