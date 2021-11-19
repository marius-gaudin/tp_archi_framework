// Ce filter prend du texte en entré et le retourne inversé (uniquement les mots, pas les lettres)

module.exports = (input) => {
  let array = input[0].split(" ");
  let reversed = array.reverse();
  console.log(reversed.join(" "));
  return reversed.join(" ");
};
