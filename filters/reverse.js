// Ce filter prend du texte en entré et le retourne inversé (uniquement les mots, pas les lettres)

module.exports = (input) => {
  const reversed = input[0].reverse();
  return reversed;
};
