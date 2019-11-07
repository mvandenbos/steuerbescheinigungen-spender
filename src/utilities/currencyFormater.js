const makeMoneyFormatter = ({
  sign = "$",
  delimiter = ",",
  decimal = ".",
  append = false,
  precision = 2,
  round = true,
  custom
} = {}) => value => {
  const e = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000];

  value = round ? Math.round(value * e[precision]) / e[precision] : parseFloat(value);

  const pieces = value
    .toFixed(precision)
    .replace(".", decimal)
    .split("");

  let ii = pieces.length - (precision ? precision + 1 : 0);

  while ((ii -= 3) > 0) {
    pieces.splice(ii, 0, delimiter);
  }

  if (typeof custom === "function") {
    return custom({
      sign,
      float: value,
      value: pieces.join("")
    });
  }

  return append ? pieces.join("") + sign : sign + pieces.join("");
};

const formatEuro = makeMoneyFormatter({
  sign: " €",
  delimiter: ".",
  decimal: ",",
  append: true
});

module.exports = {
  formatEuro: formatEuro
}