<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawerRight"
      app
      clipped
      right
      v-bind:width="310"
    >
      <v-list dense>
        <!-- green blob -->
        <liquidity-overview />

        <!-- bid/asks -->
        <div>
          <v-container>
            <v-layout class="bidasksection" row>
              <v-flex xs6 class="ps-6">
                <!-- <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-card height="18%" outline class="my-2" v-on="on">
                      <v-card-text class="text-center">
                        <p>
                          <span class="ask-threesf-font">{{
                            askupdate3sf
                          }}</span
                          ><span class="ask-bigfig-font">{{
                            askupdatebigfig
                          }}</span
                          ><span class="ask-tenthpip-font">{{
                            askupdatetenthpip
                          }}</span>
                        </p>
                      </v-card-text>
                    </v-card>
                  </template>
                  <span>ask price</span>
                </v-tooltip>

                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-card height="18%" outline class="my-2" v-on="on">
                      <v-card-text class="text-center">
                        <p>
                          <span class="bid-threesf-font">{{
                            bidupdate3sf
                          }}</span
                          ><span class="bid-bigfig-font">{{
                            bidupdatebigfig
                          }}</span
                          ><span class="bid-tenthpip-font">{{
                            bidupdatetenthpip
                          }}</span>
                        </p>
                      </v-card-text>
                    </v-card>
                  </template>
                  <span>bid price</span>
                </v-tooltip> -->

                <!-- <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-card height="12%" outline class="my-2" v-on="on">
                      <v-card-title class="subtitle-2">
                        <p class="text-center">{{ rtpslippage }} shortfall</p>
                      </v-card-title>
                    </v-card>
                  </template>
                  <span>shortfall vs arrival price (pips)</span>
                </v-tooltip> -->
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </v-list>
    </v-navigation-drawer>
    <!-- end of RHS drawer -->

    <!-- top menu -->
    <v-app-bar app clipped-right clipped-left color="#008795" dark dense>
      <v-app-bar-nav-icon @click.stop="drawerLeft = !drawerLeft" />
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="#008795" dark elevation="0" v-on="on">
            <v-toolbar-title>Algo Decentral</v-toolbar-title>
            <v-icon right>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in menuitems"
            :key="index"
            @click="select(item.route)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-spacer />

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <!-- the colon : means that the "color" attribute is bound to the connectionColour variable -->
          <v-avatar
            :color="connectionColour"
            size="24"
            v-on="on"
            @click="tickleConnection"
          >
            <span class="white--text headline;size=36">{{
              connectionStatus
            }}</span>
          </v-avatar>
        </template>
        <span>{{ connectionStatusHover }}</span>
      </v-tooltip>
      <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight" />
    </v-app-bar>
    <!-- end top menu -->

    <v-navigation-drawer v-model="drawerLeft" app clipped v-bind:width="230">
      <v-subheader> Orders </v-subheader>
      <v-list class="pa-0">
        <v-list-item-group :active-class="'borderActive'" v-model="order">
          <v-list-item
            class="my-1"
            v-for="(order, i) in orders"
            :key="i"
            @click="selectOrder(order)"
          >
            <order-tile v-bind:orderDetails="order" />
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="leftTemporary" fixed temporary />

    <v-main>
      <v-container fluid fill-height style="background: #363636">
        <v-layout row justify-center align-center no-gutters>
          <v-flex text-xs-centre fill-height>
            <!-- components appear in this section as a result of clicking the items in the left hand drawer -->
            <!-- keep-alive keeps the component in memory for a fast switch -->
            <keep-alive>
              <component :is="currentView" />
            </keep-alive>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>

    <v-navigation-drawer v-model="rightTemporary" fixed right temporary />

    <v-footer app color="#008795" class="white-text">
      <span>ALGO DECENTRAL</span>
    </v-footer>
  </v-app>
</template>



  <script>
import PriceChart from "./components/PriceChart";
import LiquidityOverview from "./components/LiquidityOverview";
import OrderTile from "./components/OrderTile";
import bus from "./bus.js";
import { Connection } from "@solana/web3.js";

async function register(url = "", data = {}) {
  console.log("sending", data);

  let req = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data, // body data type must match "Content-Type" header
  };

  console.log("request", req);

  // Default options are marked with *
  const response = await fetch(url, req);

  console.log("response", response);

  return response; // parses JSON response into native JavaScript objects
}

export default {
  name: "app",
  props: {
    source: String,
  },

  // computed things are fast. Automatically update when the underlying value changes
  // use them whenever some data can change and you want the screen to update
  computed: {
    connectionColour() {
      return this.connected === true ? "green" : "red";
    },
    connectionStatus() {
      return this.connected === true ? "C" : "D";
    },
    connectionStatusHover() {
      return this.connected === true ? "Connected" : "Disconnected";
    },
    selectedOrder() {
      return this.$store.getters.selectedOrder;
    },
    rtpslippage() {
      console.log("rtpslippage updated");
      return String(this.rtp_slippage);
    },
    // bunch of methods for formatting different digits of the price
    bidupdate3sf() {
      return String(this.bid).substr(0, 4);
    },
    askupdate3sf() {
      return String(this.ask).substr(0, 4);
    },
    bidupdatebigfig() {
      return String(this.bid).substr(4, 2);
    },
    askupdatebigfig() {
      return String(this.ask).substr(4, 2);
    },
    bidupdatetenthpip() {
      return String(this.bid).substr(6, 1);
    },
    askupdatetenthpip() {
      return String(this.ask).substr(6, 1);
    },

    paidgivenupdate() {
      if (this.paidgivens !== null) {
        var pct = Math.rouht(
          this.paidgivens[this.$store.getters.globalSelectedPair]
        );
        var paid_given = -1 * pct + "% given";

        if (pct > 0) {
          paid_given = pct + "% paid";
        } else if (pct == 0) {
          paid_given = "0%";
        }
        return paid_given;
      } else {
        return 0;
      }
    },
  },

  watch: {
    // select / unselect the highlighted order
    selectedOrder: function () {
      if (this.selectedOrder == null) {
        this.order = null;
      }
    },
  },

  data() {
    return {
      // drop down menu
      menuitems: [{ title: "Prices", route: "priceChart" }],
      usr: null,
      ws_url: "",
      drawerLeft: false,
      drawerRight: false,
      rightTemporary: false,
      leftTemporary: false,
      datacollection: null,
      order: null,
      ask: null,
      bid: null,
      rtp: null,
      paidgivens: null,
      rtp_slippage: 0,
      selected: "priceChart",
      currentView: "priceChart",
      received_messages: [],
      connected: false,
      liquidityconditions: null,
      orders: [],
      model: 1,
    };
  },
  components: {
    priceChart: PriceChart,
    liquidityOverview: LiquidityOverview,
    orderTile: OrderTile,
  },
  created() {
    this.userid = new Date().getTime();

    this.connection = new Connection("http://localhost:8899", "processed");

    bus.$on("child_orders", (child_order) => {
      console.log("App received child order  " + child_order);
      bus.$emit("child_order_update", JSON.parse(child_order));
    });

    bus.$on("orders", (stoploss_update) => {
      try {
        console.log("bus got stoploss_update" + stoploss_update);

        // create a struct - pass this into the orders list. The orders list is populated with the OrderTile component
        let order = JSON.parse(stoploss_update);
        let clientOrderId = order["own_address"];
        console.log("stoploss received: own_address " + order["own_address"]);
        var o = {
          clientOrderId: clientOrderId,
          algoname: order.algoname,
          pair: order.pair,
          side: order.side == "Ask" ? "Sell" : "Buy",
          amount: order.size,
          filled: order.filled,
          avgPrice: order.avg_price,
          limitPrice: order.limit_price,
          status: order.ord_status,
          triggerPx: order.trigger_price,
        };

        const index = this.orders.findIndex((order) => {
          return clientOrderId == order.clientOrderId;
        });

        if (index == -1) {
          this.orders.push(o);
        } else {
          this.orders.splice(index, 1, o);
          // if you select an order the pair updates in the main drop down
          if (
            this.$store.getters.selectedOrder &&
            this.$store.getters.selectedOrder.clientOrderId == o.clientOrderId
          ) {
            this.$store.commit("selectedOrder", o);
          }
        }
      } catch (e) {
        console.log("error ", e);
      }
    });

    this.connect();

    this.$vuetify.theme.dark = true;
    // thorwing error, dont know why...
    //this.$vuetify.theme.dark.background = "#002748";
  },

  methods: {
    getActiveClass(order) {
      console.log("get active class " + order + " status " + order.status);
      return order.status == 0 ? "borderActive" : "borderActive2";
    },

    connect() {
      // this registers the client in the ui-server using http. Probably better ways to do this if you are better at javascript, just get it working for now

      console.log("try connect");
      this.usr = '{ "user_id": ' + this.userid + " }";
      console.log("registering");
      register("http://localhost:8001/register", this.usr).then((data) => {
        console.log("register returned:", data);
        console.log(this.ws_url);

        let ws = "ws://127.0.0.1:8001/ws/" + this.userid;
        console.log("connecting to ws ", ws);
        this.socket = new WebSocket(ws);

        this.socket.addEventListener("open", () => {
          this.connected = true;
          this.socket.send(
            '{ "topics" : ["orders", "child_orders", "price_updates"] }'
          );
        });

        this.socket.addEventListener("message", (message) => {
          // when there are more message types cache the most recent messages locally so the UI is snappy
          //console.log("GOT MESSAGE from WEBSOCKET", message);
          this.msg = JSON.parse(message.data);
          //console.log("emitting to " + this.msg["topic"] + " message ",this.msg["message"]);

          // for now just route to internal component
          bus.$emit(this.msg["topic"], this.msg["message"]);
        });

        this.socket.addEventListener("close", () => {
          console.log("socket closed listener");
          this.disconnect();
        });
      });

      //console.log("ENV=" + process.env.VUE_APP_ENV);

      this.drawerRight = true;
      this.drawerLeft = true;
    },
    disconnect() {
      if (this.socket) {
        this.socket.close();
      }
      this.connected = false;
    },
    tickleConnection() {
      this.connected ? this.disconnect() : this.connect();
    },
    activate(elem) {
      this.selected = elem;
    },
    selectOrder(order) {
      this.$store.commit("selectOrder", order);
      console.log(order);
      this.select("priceChart");
    },
    select(elem) {
      this.currentView = elem;
      this.activate(elem);
    },
  },
};
</script>

<style scoped>
.row-full {
  width: 100vw;
}

.wide {
  width: 100%;
}

.bid {
  color: #caca00;
}

.ask {
  color: #55afb8;
}

.borderActive {
  border: 3px solid #2196f3;
  border-radius: 5px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px;

  margin-top: 0px !important;
  margin-bottom: 0px !important;
}

.borderActive2 {
  border: 3px solid #559654;
  border-radius: 5px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px;

  margin-top: 0px !important;
  margin-bottom: 0px !important;
}

.centre-text {
  text-align: center;
}

.bid-threesf-font {
  text-align: center;
  color: #caca00;
  font-size: 21px;
  font-weight: bold;
  display: inline;
}

.bid-bigfig-font {
  text-align: center;
  color: #caca00;
  font-size: 34px;
  font-weight: bold;
  display: inline;
}

.bid-tenthpip-font {
  text-align: center;
  color: #caca00;
  font-size: 12px;
  font-weight: bold;
  display: inline;
}

.ask-threesf-font {
  text-align: center;
  color: #55afb8;
  font-size: 21px;
  font-weight: bold;
  display: inline;
}

.ask-bigfig-font {
  text-align: center;
  color: #55afb8;
  font-size: 34px;
  font-weight: bold;
  display: inline;
}

.ask-tenthpip-font {
  text-align: center;
  color: #55afb8;
  font-size: 12px;
  font-weight: bold;
  display: inline;
}

.bidasksection {
  height: 245px;
}
</style>  