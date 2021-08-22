<template>
  <div class="stock">
    <v-row>
      <v-select
        v-model="selection"
        :items="items"
        dense
        outlined
        label="pairs"
        @change="update"
        class="mt-2"
      />
    </v-row>
    <!-- <v-row v-if="order">
      <v-chip label outlined color="orange">
        <v-icon left>mdi-label</v-icon> <b> END TIME: </b>
        {{ expectedTimeToCompletion }}
      </v-chip>
    </v-row> -->
    <highcharts
      class="stock70"
      :constructor-type="'chart'"
      v-bind:options="chart1"
    />
    <highcharts
      class="stock30"
      :constructor-type="'stockChart'"
      v-bind:options="chart2"
    />

    <v-data-table
      dense
      :headers="headers"
      :items="selectedChildOrders"
      item-key="name"
      class="primary"
    ></v-data-table>
  </div>
</template>

<script>
import bus from "../bus";

export default {
  data() {
    return {
      zoomed: false,
      items: ["btcusd", "ethusd", "solusd", "srmusd", "fttusd"],
      selection: "solusd",
      selectedChildOrders: [],
      allChildOrders: [],
      bidData: [],
      askData: [],
      headers: [
        { text: "parentOrderId", value: "parentOrderId" },
        { text: "childOrderId", value: "childOrderId" },
        { text: "price", value: "price" },
        { text: "side", value: "side" },
        { text: "requestedQty", value: "requestedQty" },
        { text: "baseFilledQty", value: "baseFilledQty" },
        { text: "ordStatus", value: "ordStatus" },
        { text: "limitPrice", value: "limitPrice" },
      ],
      chart1: {
        chart: {
          zoomType: "x",
          anymation: false,
        },
        rangeSelector: {
          enabled: false,
        },
        title: {
          text: null,
        },
        tooltip: {
          shared: true,
        },
        xAxis: {
          type: "datetime",
        },
        yAxis: [
          {
            title: false,
          },
        ],
        legend: {
          enabled: false,
        },
        series: [
          {
            name: "ask",
            data: [],
            step: true,
            color: "#55AFB8",
            tooltip: {
              valueDecimals: 5,
            },
            marker: {
              enabled: false,
              radius: 1,
            },
            enableMouseTracking: true,
          },
          {
            name: "bid",
            data: [],
            step: true,
            color: "#CACA00",
            tooltip: {
              valueDecimals: 5,
            },
            marker: {
              enabled: false,
              radius: 1,
            },
            enableMouseTracking: true,
          },
          {
            name: "fills",
            data: [],
            type: "scatter",
            color: "white",
            tooltip: {
              valueDecimals: 5,
            },
            marker: {
              enabled: false,
              radius: 4,
              symbol: "triangle",
            },
            enableMouseTracking: true,
          },
        ],
      },
      // chart2: {
      //   scrollbar: {
      //     enabled: false,
      //   },
      //   navigator: {
      //     enabled: false,
      //   },
      //   title: {
      //     text: null,
      //   },
      //   xAxis: {
      //     type: "datetime",
      //   },
      //   yAxis: {
      //     opposite: true,
      //   },
      //   series: [
      //     {
      //       name: "traded",
      //       pointPlacement: "on",
      //       data: [],
      //       pointStart: null,
      //       pointInterval: 1000 * 60 * 1,
      //       step: true,
      //       type: "column",
      //       tooltip: {
      //         valueDecimals: 2,
      //       },
      //       animation: {
      //         duration: 1,
      //       },
      //     },
      //   ],
      // },
    };
  },
  created() {
    this.$vuetify.theme.themes.dark.primary = "#363636";

    bus.$on("child_order_update", (child_order) => {
      console.log(
        "got child order update. clientOrderId in price chart update " +
          child_order.client_order_id
      );

      //"{\"child_order_id\":\"0\",\"client_order_id\":\"1624976098977\",\"price\":\"10\",\"price_lots\":\"2\",\"side\":\"buy\",\"size\":\"100\",\"size_lots\":\"2\"}"

      var child = {
        parentAddress: child_order.parent_address,
        clientOrderId: child_order.parent_address,
        parentOrderId: child_order.parent_order_id,
        childOrderId: child_order.child_order_id,
        parent_child_composite_id: child_order.parent_child_composite_id,
        market: child_order.market,
        side: child_order.side,
        requestedQty: child_order.requested_qty,
        limitPrice: child_order.limit_price,
        baseFilledQty: child_order.base_filled_qty,
        quoteFilledQty: child_order.quote_filled_qty,
        price: child_order.price,
        filledTime: child_order.filled_time,
        ordStatus: child_order.ord_status,
        orderType: child_order.order_type,
      };

      let index = -1;
      for (var i = 0; i < this.allChildOrders.length; i++) {
        if (
          this.allChildOrders[i].clientOrderId.toString() ===
          child.clientOrderId.toString()
        ) {
          index = i;
        }
      }

      if (index == -1) {
        console.log("new child order. Adding child order to list");
        this.allChildOrders.push(child);
      } else {
        console.log("found an existing child order, updating");
        this.allChildOrders.splice(index, 1, child);
      }

      if (this.$store.getters.selectedOrder) {
        console.log(
          "selected parent id" + this.$store.getters.selectedOrder.clientOrderId
        );
        console.log("child parent id" + child.clientOrderId.toString());
      }

      // only populate if the parent order is selected
      if (
        this.$store.getters.selectedOrder &&
        child.clientOrderId.toString() ===
          this.$store.getters.selectedOrder.clientOrderId.toString() &&
        this.selectedChildOrders != null
      ) {
        console.log(
          "select length " +
            this.selectedChildOrders.length +
            " object " +
            this.selectedChildOrders[0]
        );
        index = -1;
        for (var j = 0; i < this.selectedChildOrders.length; i++) {
          console.log("looping, j=" + j);
          if (
            this.selectedChildOrders[j].clientOrderId.toString() ===
            child.clientOrderId.toString()
          ) {
            index = i;
          }
        }

        console.log(
          "selected " +
            this.$store.getters.selectedOrder.clientOrderId.toString()
        );

        if (index == -1) {
          this.selectedChildOrders = [child];
        } else {
          this.selectedChildOrders.splice(index, 1, child);
        }
      }
    });

    bus.$on("price_updates", (price_update) => {
      console.log("price update in chart component " + price_update);
      let json_price_update = JSON.parse(price_update);

      var sym = json_price_update["market"];

      if (this.items.indexOf(sym) < 0) {
        this.items.push(sym);
      }
      if (sym == this.$store.getters.globalSelectedPair) {
        this.fillData(json_price_update);
      }
    });
  },
  computed: {
    pair() {
      return this.$store.getters.globalSelectedPair;
    },
    order() {
      return this.$store.getters.selectedOrder;
    },
    expectedTimeToCompletion() {
      var date = new Date(
        Number(this.$store.getters.selectedOrder.expectedTimeToCompletion)
      );
      return date;
    },
  },
  watch: {
    // either the pair can change, or the order can change
    // this function has to know whether to subscribe to the price (unknown start/end) OR the order
    // which has a definite start/end
    // TODO split into another chart so there is OrdersChart and PriceChart
    // OrdersChart can have fills
    // PriceChart is just for the prices
    pair: function (newPair, oldPair) {
      this.bidData = [];
      this.askData = [];
      this.selection = newPair;
      console.log("changed from " + oldPair + " to " + newPair);
      bus.$emit("unsubscribe", oldPair);
      // if there is an order in the cache then update the fills by selecting the correct order startTime
      if (this.$store.getters.selectedOrder) {
        var newOrder = this.$store.getters.selectedOrder;
        console.log(
          "################# subscribing for order " + JSON.stringify(newOrder)
        );
        bus.$emit("subscribe_price", {
          startTime: newOrder.startTime,
          pair: newOrder.pair,
          endTime: newOrder.endTime,
          orderQty: newOrder.amount,
        });
        // just subscribe now
        bus.$emit("subscribe_price", {
          startTime: null,
          pair: newPair,
          endTime: null,
          orderQty: 0,
        });

        console.log("all child order length " + this.allChildOrders.length);
        let childOrder = null;

        for (var i = 0; i < this.allChildOrders.length; i++) {
          //console.log("got orderId " + this.allChildOrders[i].orderId + " size " + this.allChildOrders[i].size + " clientOrderId " +  this.allChildOrders[i].clientOrderId + " childOrderId " + newOrder.clientOrderId);
          if (
            this.allChildOrders[i].clientOrderId.toString() ===
            newOrder.clientOrderId.toString()
          ) {
            childOrder = this.allChildOrders[i];
          }
        }

        console.log(
          "order changed to " +
            newOrder.clientOrderId +
            " found in allOrders " +
            childOrder
        );

        this.selectedChildOrders = [childOrder];
      }
    },
    order: function (newOrder, oldOrder) {
      this.bidData = [];
      this.askData = [];

      console.log("order trigger fired new " + newOrder + " old " + oldOrder);
      var shouldAddFills = true;
      if (newOrder) {
        console.log("looks like order changed " + newOrder);
        const index = this.allChildOrders.findIndex((o) => {
          return (
            newOrder.clientOrderId.toString() === o.clientOrderId.toString()
          );
        });

        this.selectedChildOrders = [this.allChildOrders[index]];
      }

      if (newOrder && oldOrder) {
        console.log(
          "order updated " + newOrder.orderId + " old " + oldOrder.orderId
        );
        // catch where order has changed, but pair has not
        if (
          newOrder.orderId != oldOrder.orderId &&
          newOrder.pair == oldOrder.pair
        ) {
          bus.$emit("unsubscribe", this.selection);
          bus.$emit("subscribe_price", {
            startTime: newOrder.startTime,
            pair: newOrder.pair,
            endTime: newOrder.endTime,
            orderQty: newOrder.amount,
          });
          shouldAddFills = false;
        }
        if (
          newOrder.orderId != oldOrder.orderId &&
          newOrder.pair != oldOrder.pair
        ) {
          shouldAddFills = false;
        }
        if (!oldOrder && newOrder) {
          bus.$emit("unsubscribe", this.selection);
          bus.$emit("subscribe_price", {
            startTime: newOrder.startTime,
            pair: newOrder.pair,
            endTime: newOrder.endTime,
            orderQty: newOrder.amount,
          });
          shouldAddFills = false;
        }

        if (shouldAddFills) {
          this.addFills();
        }
      }
    },
  },

  methods: {
    update(selection) {
      // null out the order because the user has changed selection to new ccy - ie there is no selected order anymore
      // so we need to unselect
      this.$store.commit("selectOrder", null);
      this.$store.commit("selectPair", selection);
    },

    addFills: function () {
      var idx;
      var date;
      //var order_long_date;
      // only show 5 mins of fills so it matches tte prices
      var startTime = new Date();
      startTime.setMinutes(startTime.getMinutes() - 5);

      console.log("adding fills since " + new Date(startTime));
      var orderFills = [];
      var newOrder = this.$store.getters.selectedOrder;

      // if it exists and has some fills
      if (newOrder && "lastSpotPrices" in newOrder) {
        // adding fills
        var fills = newOrder.lastSpotPrices.split("_");
        var times = newOrder.orderValues.values["transactionTime"].split("_");
        var status = newOrder.orderValues["status"].split("_").slice(-1)[10];
        console.log("order status " + status);

        for (idx = 0; idx < times.length - 1; idx++) {
          date = new Date(Number(times[idx]));
          // order_long_date = Date.UTC(
          //   date.getFullYear(),
          //   date.getMonth(),
          //   date.getDate(),
          //   date.getHours(),
          //   date.getMinutes(),
          //   date.getSeconds(),
          //   date.getMilliseconds()
          // );

          if (
            new Date(date).getTime() > startTime.getTime() ||
            status == "filled"
          ) {
            orderFills.push([date, Number(fills[idx])]);
          }
        }

        // buys and sells have up and down triagles to tell the direction
        if (this.$store.getters.selectedOrderIsBaseBuy) {
          this.chart1.series[2].market.symbol = "triangle";
        } else {
          this.chart1.series[2].market.symbol = "triangle-down";
        }
        this.chart1.series[2].data = orderFills;
      }

      if (!newOrder) {
        this.chart1.series[2].data = [];
      }
    },

    fillData(price_update) {
      var bids = price_update["bid"];
      var asks = price_update["ask"];
      var times = price_update["time"];

      var date = new Date(Number(times));
      var long_date = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      );
      this.bidData.push([long_date, Number(bids)]);
      this.askData.push([long_date, Number(asks)]);

      //     this.addFills();

      this.chart1.series[0].data = this.askData;
      this.chart1.series[1].data = this.bidData;
    },
  },
};
</script>

<style scoped>
.stocks {
  width: 100%;
  height: 80%;
  margin: 0 auto;
}

.stocks30 {
  width: 100%;
  height: 140px;
  margin: 0 auto;
}

.stocks70 {
  width: 100%;
  height: 650px;
  margin: 0 auto;
}

.pricetable {
  color: #363636;
}
</style>