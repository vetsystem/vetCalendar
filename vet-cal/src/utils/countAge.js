import { formatDistanceToNowStrict, isValid } from "date-fns";
import { cs } from "date-fns/locale";

const countAge = (birthDate) => {
  if (isValid(new Date(birthDate)))
    return formatDistanceToNowStrict(new Date(birthDate), { locale: cs });
  return "";
};

export default countAge;
