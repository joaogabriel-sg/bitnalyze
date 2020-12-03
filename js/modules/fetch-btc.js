export default class BitcoinDatas {
  constructor({ now, forHundred }) {
    this.now = document.querySelector(now);
    this.forHundred = document.querySelector(forHundred);
    this.btcDatas = [];
    this.getBitcoinDatas = this.getBitcoinDatas.bind(this);
  }

  updateBitcoinValue(actualValue) {
    const actualValueSize = Math.floor(actualValue).toString().length;
    const actualValueFixed = actualValue.toFixed(2);

    let regexp = '';
    if (actualValueSize === 6) {
      regexp = /([\d+]{3})([\d+]{3})[\D]([\d+]{2})/g;
    } else if (actualValueSize === 5) {
      regexp = /([\d+]{2})([\d+]{3})[\D]([\d+]{2})/g;
    }

    this.now.innerText = actualValueFixed.replace(regexp, '$1.$2,$3');
    this.forHundred.innerText = `${(100 / actualValue).toFixed(5)}`;
  }

  async getBitcoinDatas() {
    const { data } = await (await fetch('https://api.bitcointrade.com.br/v3/public/BRLBTC/ticker')).json();

    const btcDatasLastItem = this.btcDatas[this.btcDatas.length - 1];
    const lastData = btcDatasLastItem ? btcDatasLastItem.last : null;

    if (data.last !== lastData || this.btcDatas.length === 0) {
      this.btcDatas.push(data);
      this.updateBitcoinValue(data.last);
    }
  }

  init() {
    if (this.now && this.forHundred) {
      this.getBitcoinDatas();
      setInterval(this.getBitcoinDatas, 10000);
    }
    return this;
  }
}
