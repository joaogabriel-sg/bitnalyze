export default class BitcoinDatas {
  constructor({
    priceNowDiv,
    hundredDiv,
    countdownDetails: { countdownNumber, countdownCircle },
    variationDetails: { variationDiv, positiveClass, negativeClass },
    graph,
    dataQuantity,
    changeDetails: { changeRange, changePriceBRL, changePriceBTC },
  }) {
    this.priceNowDiv = document.querySelector(priceNowDiv);
    this.hundredDiv = document.querySelector(hundredDiv);
    this.dataQuantity = dataQuantity;

    this.variationDiv = document.querySelector(variationDiv);
    this.positiveClass = positiveClass;
    this.negativeClass = negativeClass;

    this.countdownNumber = document.querySelector(countdownNumber);
    this.countdownCircle = document.querySelector(countdownCircle);
    this.countdownTime = 30;

    this.ctx = document.querySelector(graph).getContext('2d');
    this.isGraphfirstCreation = true;

    this.changeRange = document.querySelector(changeRange);
    this.changePriceBRL = document.querySelector(changePriceBRL);
    this.changePriceBTC = document.querySelector(changePriceBTC);

    this.btcDatas = [];
  }

  applyRegexp(valueFixed) {
    const partInteger = valueFixed.replace(/[.,](\d+)/g, '');
    const partDecimal = valueFixed.replace(/(\d+)[.,]/g, '');

    if (partInteger.toString().length === 1) {
      this.changePriceBRL.value = `${partInteger},${partDecimal || '00'}`;
    }
    if (partInteger.toString().length === 2) {
      this.changePriceBRL.value = `${partInteger},${partDecimal || '00'}`;
    }
    if (partInteger.toString().length === 3) {
      this.changePriceBRL.value = `${partInteger},${partDecimal || '00'}`;
    }
    if (partInteger.toString().length === 4) {
      const newInteger = partInteger.replace(/([\d]{1})([\d+]{3})/g, '$1.$2');
      this.changePriceBRL.value = `${newInteger},${partDecimal || '00'}`;
    }
    if (partInteger.toString().length === 5) {
      const newInteger = partInteger.replace(/([\d]{2})([\d+]{3})/g, '$1.$2');
      this.changePriceBRL.value = `${newInteger},${partDecimal || '00'}`;
    }
    if (partInteger.toString().length === 6) {
      const newInteger = partInteger.replace(/([\d]{3})([\d+]{3})/g, '$1.$2');
      this.changePriceBRL.value = `${newInteger},${partDecimal || '00'}`;
    }
  }

  verifyChangePriceBRL() {
    if (this.changePriceBRL.value.length === 0) {
      this.changePriceBRL.value = '0,00';
      return;
    }

    if (this.changePriceBRL.value > 100000) {
      this.changePriceBRL.value = '100.000,00';
      this.changePriceBRL.removeEventListener('blur', this.verifyChangePriceBRL);
    } else {
      const priceBrlFixed = Number(this.changePriceBRL.value).toFixed(2);

      if (!priceBrlFixed.includes('.')) {
        this.changePriceBRL.value = '0,00';
      } else {
        this.applyRegexp(priceBrlFixed);
      }
    }
  }

  defineUpdatedChange(value) {
    const toPercentage = value / 1000;
    const inBTC = value / this.btcDatas[this.btcDatas.length - 1].last;

    this.changeRange.value = value;
    this.changeRange.style.background = `linear-gradient(90deg, var(--orange-color) ${toPercentage}%, var(--light-color) ${toPercentage}%)`;
    this.changePriceBTC.innerText = inBTC.toFixed(8);
  }

  defineInitialChange() {
    this.changeRange.value = 0;
    this.changeRange.style.background = 'linear-gradient(90deg, var(--light-color) 50%, var(--light-color) 50%)';
    this.changePriceBTC.innerText = '0.00000000';
  }

  onKeyUpEvent() {
    const typedValue = Number(this.changePriceBRL.value);

    if (Number.isNaN(typedValue)) {
      this.defineInitialChange();
    } else if (typedValue > 100000) {
      this.verifyChangePriceBRL();
      this.defineUpdatedChange(100000);
    } else {
      this.changePriceBRL.addEventListener('blur', this.verifyChangePriceBRL);
      this.defineUpdatedChange(typedValue);
    }
  }

  onInputEvent() {
    const { value } = this.changeRange;
    const toPercentage = value / 1000;
    const inBTC = value / this.btcDatas[this.btcDatas.length - 1].last;

    this.changeRange.style.background = `linear-gradient(90deg, var(--orange-color) ${toPercentage}%, var(--light-color) ${toPercentage}%)`;

    this.changePriceBRL.value = Number(value).toFixed(2).replace('.', ',');
    this.changePriceBTC.innerText = inBTC.toFixed(8);

    const priceFixed = Number(this.changePriceBRL.value.substring(0, this.changePriceBRL.value.indexOf(','))).toFixed(2);
    this.applyRegexp(priceFixed);
  }

  activeBrlToBtcChange() {
    this.changeRange.addEventListener('input', this.onInputEvent);
    this.changePriceBRL.addEventListener('keyup', this.onKeyUpEvent);
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
          label: 'Valor BTC',
          data: [],
          backgroundColor: '#f68927',
          borderColor: '#051721',
          borderWidth: 1,
        }],
      },
      options: {
        tooltips: {
          backgroundColor: '#051721',
          titleFontFamily: "'Nunito', 'Arial', 'Helvetica', sans-serif",
          titleFontSize: 14,
          titleAlign: 'center',
          bodyFontFamily: "'Nunito', 'Arial', 'Helvetica', sans-serif",
          bodyFontSize: 14,
          xPadding: 8,
          yPadding: 8,
          cornerRadius: 10,
        },
        title: {
          display: true,
          text: 'Representação Gŕafica do Bitcoin',
          fontFamily: "'Nunito', 'Arial', 'Helvetica', sans-serif",
          fontSize: 18,
          fontColor: '#051721',
        },
        legend: {
          display: false,
        },
        responsive: false,
      },
    });
  }

  isZeroNecessary(number) {
    return number < 10 ? `0${number}` : number;
  }

  getActualHour({ date }) {
    const actualDate = new Date(date);

    return `${this.isZeroNecessary(actualDate.getHours())}h:${this.isZeroNecessary(actualDate.getMinutes())}m:${this.isZeroNecessary(actualDate.getSeconds())}s`;
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
      this.countdownCircle.classList.remove('anime');
      this.getBitcoinDatas();
    }
    this.countdownCircle.classList.add('anime');
    this.countdownTime--;
    this.countdownNumber.innerText = this.countdownTime;
  }

  functionsToBind() {
    this.getBitcoinDatas = this.getBitcoinDatas.bind(this);
    this.getActualHour = this.getActualHour.bind(this);
    this.countdownTimer = this.countdownTimer.bind(this);
    this.onInputEvent = this.onInputEvent.bind(this);
    this.onKeyUpEvent = this.onKeyUpEvent.bind(this);
    this.verifyChangePriceBRL = this.verifyChangePriceBRL.bind(this);
  }

  init() {
    if (this.priceNowDiv && this.hundredDiv && this.variationDiv) {
      this.functionsToBind();
      this.getBitcoinDatas();
      this.activeBrlToBtcChange();
      setInterval(this.countdownTimer, 1000);
    }
    return this;
  }
}
