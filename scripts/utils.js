export default class Utilities {
  static getRandom(questions) {
    let index = Math.floor(Math.random() * questions.length);
    return questions[index];
  }

  static padDigits(n) {
    return (n < 10 ? "0" : "") + n;
  }
}