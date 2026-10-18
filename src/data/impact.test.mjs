import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const impact = JSON.parse(readFileSync(new URL("./impact.json", import.meta.url), "utf8"));

test("education impact reflects over 150 scholarships", () => assert.equal(impact.students, 150));
test("Ramadan impact reflects over 8000 meals", () => assert.equal(impact.meals, 8000));
test("Ramadan impact reflects over 200 food packages", () => assert.equal(impact.foodPackages, 200));
test("three-year mobility impact reflects over 15 wheelchairs and mobility tools", () => assert.equal(impact.mobilityAids, 15));
test("health camp impact reflects over 200 families", () => assert.equal(impact.healthFamilies, 200));