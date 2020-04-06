export default class Random {
  static shuffleArray(array) {
    let sorted = [...array];
    for (var i = sorted.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = sorted[i];
      sorted[i] = sorted[j];
      sorted[j] = temp;
    }
    return sorted;
  }

  static select(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}
