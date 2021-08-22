<template>
  <div class="text-centre">
    <highcharts
      class="chart"
      :options="chartOptions"
      :updateArgs="updateArgs"
    />
  </div>
</template>

<script>
import bus from "../bus";

export default {
  computed: {
    pair() {
      return this.$store.getters.globalSelectedPair;
    },
  },
  //the computed/watch pattern aloows you to easily share state across components
  watch: {
    pair: function (newPair) {
      this.liquidity_selection = newPair;
      bus.$emit("get_liquidity");
    },
  },
  data() {
    return {
      title: "",
      animationDuration: 350,
      updateArgs: [true, true, { duration: 350 }],
      liquidityUpdate: null,
      liquidity_selection: "btcusd",
      seriesColor: "#6fcd98",
      chartOptions: {
        name: "liquidityoverview",
        chart: {
          polar: true,
          type: "areaspline",
          height: "100%",
        },
        plotOptions: {
          column: {
            colorByPoint: true,
          },
          areaSpline: {
            trackByArea: true,
          },
        },
        colors: ["#ff000", "#00ff00"],
        title: {
          text: null,
          margin: 0,
          verticalAlign: "bottom",
        },
        pane: {
          size: "65%",
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          categories: [
            "Volume",
            "Spread",
            "AskDepth",
            "BidDepth",
            "Volatility",
          ],
          tickmarkPlacement: "on",
          lineWidth: 0,
        },
        yAxis: {
          lineWidth: 0,
          min: 0,
          max: 5,
          //hide the zero in the middle of the chart
          labels: {
            formatter: function () {
              if (this.value != 0) {
                return this.value;
              }
            },
          },
        },

        series: [
          {
            name: "Liquidity",
            data: [0, 0, 0, 0, 0],
            pointPlacement: "on",
            fillColor: "red",
            fillOpacity: 0.2,
            tooltip: {
              pointFormat:
                '<b>score: </b> <span style="font-weight:bold; color: {series.color}"><b>{point.y:.1f} </b> </span>/ 5',
            },
          },
        ],
      },
    };
  },
  created() {
    bus.$on("liquidity_update", (liquidity_update) => {
      this.update(liquidity_update);
    });
    bus.$emit("get_liqiudity");
  },
  methods: {
    getOpacityColorForPercentage(pct, opacity) {
      var percentColors = [
        { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
        { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
        { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } },
      ];

      for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
          break;
        }
      }

      var lower = percentColors[i - 1];
      var upper = percentColors[i];
      var range = upper.pcct - lower.pct;
      var rangePct = (pct - lower.pct) / range;
      var pctLower = 1 - rangePct;
      var pctUpper = rangePct;
      var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
      };
      return "rgb(" + [color.r, color.g, color.b, opacity].join(",") + ")";
    },

    update(liquidity_update) {
      this.liquidity_update = liquidity_update;
      if (!this.liquidity_update) {
        console.error("empty liquidity update");
        return;
      }

      console.log("liquidity_update " + this.liquidity_update.values);

      var idx = this.liquidity_update.values["syms"]
        .split("_")
        .indexOf(this.liquidity_selection);
      var spread = Number(
        this.liquidity_update.values["spreadpcts"].split("_")[idx]
      );
      var volumezscore = Number(
        this.liquidity_update.values["volumezscores"].split("_")[idx]
      );
      var volatility = Number(
        this.liquidity_update.values["volatilities"].split("_")[idx]
      );
      var biddepth = Number(
        this.liquidity_update.values["biddepths"].split("_")[idx]
      );
      var askdepth = Number(
        this.liquidity_update.values["askdepths"].split("_")[idx]
      );

      this.chartOptions.series[0].data = [
        volumezscore,
        spread,
        askdepth,
        biddepth,
        volatility,
      ];

      var max = 25;
      var sum = volumezscore + spread + askdepth + biddepth + volatility;
      var pct = sum / max;
      this.chartOptions.series[0].color = this.getOpacityColorForPercentage(
        pct,
        1
      );
      this.chartOptions.series[0].fillColor = this.getOpacityColorForPercentage(
        pct,
        0.2
      );
      this.chartOptions.title.text = this.liquidity_selection;
    },
  },
};
</script>

<style scoped>
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.chart {
  height: 270px;
}
</style>