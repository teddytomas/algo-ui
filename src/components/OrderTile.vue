<template>
  <div>
    <v-card class="border" max-width="230" hover @click="select">
      <v-list-item three-line>
        <v-list-item-content>
          <div class="mb-1">
            {{ orderDetails.side }} {{ orderDetails.pair }} -
            {{ orderDetails.algoname }}
          </div>
          <div class="mb-1">
            {{ orderDetails.status }}
          </div>
          <v-list-item-subtitle>
            filled {{ orderDetails.filled }} / {{ orderDetails.amount }} @ px
            {{ orderDetails.avgPrice }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            triggerPx {{ orderDetails.triggerPx }}
          </v-list-item-subtitle>
          <v-progress-linear color="#008795" v-model="percentFilled" />
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
export default {
  computed: {
    percentFilled() {
      return (
        (100 * Number(this.orderDetails.filled)) /
        Number(this.orderDetails.amount)
      );
    },
  },
  data() {
    return {
      selected: false,
    };
  },
  methods: {
    select: function () {
      this.selected = !this.selected;
      // fire off an event to get the data for the order
    },
  },
  props: {
    orderDetails: Object,
  },
};
</script>

<style scoped>
.border {
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-left: 0px;
  margin-right: 0px;
}
</style>