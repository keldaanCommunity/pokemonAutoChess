
class PriorityQueue {
  constructor() {
    this._data = [];
    this.length = 0;
  }

  push(value, cost) {
    this._data.push({value: value, cost: cost});
    this.length++;
    this._u(this.length - 1);
  }

  pop() {
    const a = this._data[0];
    const b = this._data.pop();
    this.length = this.length > 0 ? this.length - 1 : 0;
    if (this.length > 0) {
      this._data[0] = b;
      this._d(0);
    }
    return a.value;
  }

  peek() {
    return this._data[0].value;
  }

  _u(i) {
    const a = this._data[i];
    while (i > 0) {
      const j = (i - 1) >> 1;
      const b = this._data[j];
      if (a.cost >= b.cost) break;
      this._data[i] = b;
      i = j;
    }
    this._data[i] = a;
  }

  _d(i) {
    const a = this._data[i];
    const half = this.length >> 1;
    while (i < half) {
      let j = (i << 1) + 1;
      let b = this._data[j];
      const k = j + 1;
      if (k < this.length && this._data[k].cost < b.cost) {
        j = k;
        b = this._data[k];
      }
      if (b.cost >= a.cost) break;
      this._data[i] = b;
      i = j;
    }
    this._data[i] = a;
  }
}

module.exports = PriorityQueue;
