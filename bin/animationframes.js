const grid = [
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
  `........................`,
];
let f1 = grid.map((item, ind) => {
  let arr = Array.from(item);
  arr[ind] = ":";
  return arr.join("");
});

let f5 = grid.map((item, index) => {
  let arr = Array.from(item);
  let marr = arr.map((it, ind) => {
    if ((ind + index) % 3 == 0) {
      return "■";
    }
    return it;
  });
  return marr.join("");
});

const f2 = [`(>_<)`, "[o_o]"];
const f3 = Array.from(`~!@#$%^&*_-+=`).map((it) => `[ ${it} ${it} ]`)
const f4 = [
  "[  │ | | | | | | | | | | | | |  ]",
  "[  ║  ║  ║  ║  ║  ║  ║  ║  ║    ]",
  "[  ▌   ▌   ▌   ▌   ▌   ▌   ▌    ]",
  "[  █    █    █    █    █    █   ]",
];
frames=f4;

module.exports = {frames,f1,f2,f3,f4,f5};
