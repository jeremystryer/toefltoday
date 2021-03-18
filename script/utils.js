export default class Utilities {
  static getRandom(questions) {
    let index = Math.floor(Math.random() * questions.length);
    return questions[index];
  }
}