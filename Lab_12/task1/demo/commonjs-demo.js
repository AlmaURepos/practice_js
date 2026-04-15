const MyLib = require("../modules/commonjs/MyLib.js");

console.log("CommonJS Demo");
console.log("Version:", MyLib.version);

console.log("unique:", MyLib.utils.array.unique([1, 2, 2, 3, 3, 4]));
console.log("chunk:", MyLib.utils.array.chunk([1, 2, 3, 4, 5, 6], 2));
console.log("groupBy:", MyLib.utils.array.groupBy(
  [
    { type: "fruit", name: "apple" },
    { type: "fruit", name: "banana" },
    { type: "vegetable", name: "carrot" }
  ],
  "type"
));

console.log("capitalize:", MyLib.utils.string.capitalize("hELLo"));
console.log("slugify:", MyLib.utils.string.slugify("Hello World From JS"));

console.log("pick:", MyLib.utils.object.pick(
  { id: 1, name: "Aidos", age: 20 },
  ["id", "name"]
));

console.log("omit:", MyLib.utils.object.omit(
  { id: 1, name: "Aidos", age: 20 },
  ["age"]
));

console.log("deepClone:", MyLib.utils.object.deepClone({
  user: { name: "Aidos" },
  items: [1, 2, 3]
}));