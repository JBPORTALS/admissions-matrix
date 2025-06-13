import { createLoader, parseAsString, parseAsStringEnum } from "nuqs/server";

export const genderSearchParams = {
  gender: parseAsStringEnum(["MALE", "FEMALE"]).withDefault("MALE"),
};

export const loadGenderSearchParams = createLoader(genderSearchParams);
