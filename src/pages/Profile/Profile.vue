<template>
  <v-container fluid>
    <v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
      <h1 class="page-title">1223</h1>
    </v-row>
    <v-row>
      <v-col lg="6" sm="12" md="10" cols="24">
        <v-card class="mx-1 mb-1">
          <v-card-title class="pa-6 pb-3">
            <div style="border: 1px dashed #ff4081; border-radius: 50%; padding: 8px">
              <v-img src="@/assets/profile.png"></v-img>
            </div>
            <div style="margin-left: 15px">
              <h3>Julee Cruise</h3>
              <span>Product Designer</span>
              <br>
              <a href="http://www.gdbtu.edu.cn/">广东工商职业技术大学</a>
              <br>
              <v-chip small color="rgba(83, 103, 254, 0.2)" label text-color="#536dfe">123</v-chip>
              <v-chip style="margin-left: 5px" small color="rgba(83, 103, 254, 0.2)" label text-color="#536dfe">123</v-chip>
              <v-chip style="margin-left: 5px" small color="rgba(83, 103, 254, 0.2)" label text-color="#536dfe">123</v-chip>
              <v-chip style="margin-left: 5px" small color="rgba(83, 103, 254, 0.2)" label text-color="#536dfe">123</v-chip>
              <v-chip style="margin-left: 5px" small color="rgba(83, 103, 254, 0.2)" label text-color="#536dfe">123</v-chip>
            </div>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import mock from "@/pages/Dashboard/mock"
export default {
  name: "Profile",
  data() {
    return {
      mock
    }
  },
  methods: {
    getRandomDataForTrends() {
      const arr = [];
      for (let i = 0; i < 12; i += 1) {
        arr.push(Math.random().toFixed(1) * 10);
      }
      return arr;
    },
  }
}
</script>
