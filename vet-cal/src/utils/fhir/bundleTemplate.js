function bundleTemplate() {
  return { resourceType: "Bundle", type: "transaction", entry: [] };
}

function bundleEntryTemplate() {
  return {
    request: {
      method: "",
      url: "",
    },
  };
}

export { bundleTemplate, bundleEntryTemplate };
