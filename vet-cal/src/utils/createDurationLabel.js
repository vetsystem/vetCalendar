const createDurationLabel = (minutes) => {
  if (minutes > 59) {
    if (minutes === 1440) {
      return "1 den";
    }
    const h = Math.trunc(minutes / 60);
    const m = minutes % 60;
    let labelH = `${h} hod`;
    let labelM = m > 0 ? ` ${m} min` : "";

    return labelH.concat(labelM);
  } else return `${minutes} min`;
};

export default createDurationLabel;
