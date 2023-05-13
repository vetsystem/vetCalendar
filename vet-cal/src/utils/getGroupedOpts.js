const getGroupedOpts = (selection, optList) => {
  let groupedList;
  if (selection.length === 0) {
    groupedList = optList.map((ent) => {
      return { ...ent, group: "Vše" };
    });
  } else {
    groupedList = optList.map((ent) =>
      selection.find((id) => id === ent.id)
        ? { ...ent, group: "Výběr" }
        : { ...ent, group: "Ostatní" }
    );
  }
  return groupedList.sort(
    (a, b) => -a.group.toString().localeCompare(b.group.toString())
  );
};

const getGroups = (option) => option.group;

export { getGroupedOpts, getGroups };
