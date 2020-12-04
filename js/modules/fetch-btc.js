export default class BitcoinDatas {
  constructor({
    priceNowDiv,
    hundredDiv,
    countdownTimeDiv,
    variationDetails: { variationDiv, positiveClass, negativeClass },
    graph,
    dataQuantity,
  }) {
    this.priceNowDiv = document.querySelector(priceNowDiv);
    this.hundredDiv = document.querySelector(hundredDiv);
    this.dataQuantity = dataQuantity;

    this.variationDiv = document.querySelector(variationDiv);
    this.positiveClass = positiveClass;
    this.negativeClass = negativeClass;

    this.countdownTimeDiv = document.querySelector(countdownTimeDiv);
    this.countdownTime = 30;

    this.ctx = document.querySelector(graph).getContext('2d');
    this.isGraphfirstCreation = true;

    this.btcDatas = [];
  }

  insertDatasInGraph(datas) {
    this.myChart.data.datasets.forEach((dataset) => {
      if (dataset.data.length === this.dataQuantity) dataset.data.shift();
    });
    this.myChart.data.datasets.forEach((dataset) => dataset.data.push(datas[datas.length - 1]));
  }

  insertLabelsInGraph(hours) {
    if (this.myChart.data.labels.length === this.dataQuantity) this.myChart.data.labels.shift();
    this.myChart.data.labels.push(hours[hours.length - 1]);
  }

  renderGraph() {
    this.myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Valor BTC:',
          data: [],
          backgroundColor: '#f68927',
          borderColor: '#051721',
          borderWidth: 1,
        }],
      },
      options: {},
    });
  }

  isZeroNecessary(number) {
    return number < 10 ? `0${number}` : number;
  }

  getActualHour({ date }) {
    const actualDate = new Date(date);

    return `${this.isZeroNecessary(actualDate.getHours())}:${this.isZeroNecessary(actualDate.getMinutes())}:${this.isZeroNecessary(actualDate.getSeconds())}`;
  }

  createGraph() {
    const hours = this.btcDatas.map(this.getActualHour);
    const datas = this.btcDatas.map((({ last }) => last));

    if (this.isGraphfirstCreation) {
      this.isGraphfirstCreation = false;
      this.renderGraph();
    }

    this.insertLabelsInGraph(hours);
    this.insertDatasInGraph(datas);
    this.myChart.update();
  }

  defineCorrectClass(lastValue, penultimateValue) {
    if (lastValue && penultimateValue) {
      const variation = lastValue / penultimateValue;
      this.variationDiv.innerText = `${(variation - 1).toFixed(5)}%`;

      if (variation >= 1) {
        this.variationDiv.classList.add(this.positiveClass);
        this.variationDiv.classList.remove(this.negativeClass);
      } else {
        this.variationDiv.classList.add(this.negativeClass);
        this.variationDiv.classList.remove(this.positiveClass);
      }
    } else {
      this.variationDiv.innerText = '0%';
      this.variationDiv.classList.add(this.negativeClass);
    }
  }

  updateBitcoinVariation() {
    const lastPos = this.btcDatas[this.btcDatas.length - 1];
    const penultimatePos = this.btcDatas[this.btcDatas.length - 2];

    const lastValue = lastPos ? lastPos.last : 0;
    const penultimateValue = penultimatePos ? penultimatePos.last : 0;

    this.defineCorrectClass(lastValue, penultimateValue);
  }

  defineRegexpForBtcValue(btcValue) {
    const btcValueLength = Math.floor(btcValue).toString().length;
    this.btcRegexp = '';
    if (btcValueLength === 6) {
      this.btcRegexp = /([\d+]{3})([\d+]{3})[\D]([\d+]{2})/g;
    } else if (btcValueLength === 5) {
      this.btcRegexp = /([\d+]{2})([\d+]{3})[\D]([\d+]{2})/g;
    }
  }

  updateBitcoinValue(btcValue) {
    this.defineRegexpForBtcValue(btcValue);

    this.actualBtc = btcValue.toFixed(2).replace(this.btcRegexp, '$1.$2,$3');

    this.priceNowDiv.innerText = this.actualBtc;
    this.hundredDiv.innerText = `${(100 / btcValue).toFixed(8)}`;
  }

  async getBitcoinDatas() {
    const { data } = await (await fetch('https://api.bitcointrade.com.br/v3/public/BRLBTC/ticker')).json();

    const btcDatasLastItem = this.btcDatas[this.btcDatas.length - 1];
    const lastData = btcDatasLastItem ? btcDatasLastItem.last : null;

    if (data.last !== lastData || this.btcDatas.length === 0) {
      if (this.btcDatas.length === this.dataQuantity) this.btcDatas.shift();
      this.btcDatas.push(data);

      this.updateBitcoinValue(data.last);
      this.updateBitcoinVariation();
      this.createGraph();
    }
  }

  countdownTimer() {
    if (this.countdownTime === 0) {
      this.countdownTime = 30;
      this.getBitcoinDatas();
    }
    this.countdownTimeDiv.innerText = this.countdownTime;
    this.countdownTime--;
  }

  functionsToBind() {
    this.getBitcoinDatas = this.getBitcoinDatas.bind(this);
    this.getActualHour = this.getActualHour.bind(this);
    this.countdownTimer = this.countdownTimer.bind(this);
  }

  init() {
    if (this.priceNowDiv && this.hundredDiv && this.variationDiv) {
      this.functionsToBind();
      this.getBitcoinDatas();
      setInterval(this.countdownTimer, 1000);
    }
    return this;
  }
}
