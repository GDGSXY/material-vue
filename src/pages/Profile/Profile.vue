<template>
  <v-container fluid>
    <v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
      <h1 class="page-title">1223</h1>
    </v-row>
    <v-row no-gutters>
      <v-col lg="6" sm="6" md="5" cols="6">
        <v-card class="container">
          <v-card-title>
            <v-row>
              <v-col lg="6">
                <div style="border: 1px dashed #ff4081; border-radius: 50%; padding: 8px">
                  <v-img src="@/assets/profile.png"></v-img>
                </div>
              </v-col>
              <v-col lg="4">
                <div class="text-h5 grey--text text--darken-3 px-4 pt-4">Admin</div>
                <v-chip>123</v-chip>
                <v-chip>123</v-chip>
                <v-chip>123</v-chip>
                <v-chip>123</v-chip>
              </v-col>
              <v-col lg="2">
                <v-menu>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon color="textColor">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                        v-for="(item, i) in mock.menu"
                        :key="i"
                        @click="() => {}"
                    >
                      <v-list-item-title>{{ item }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
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