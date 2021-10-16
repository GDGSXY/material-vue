<template>
  <v-app>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="7" class="main-part d-none d-md-none d-lg-flex">
          <div class="d-flex">
            <v-img src="@/assets/logo.svg" contain></v-img>
            <p>广工商职业技术大学管理系统</p>
          </div>
        </v-col>
        <v-col cols="12" lg="5" class="login-part d-flex align-center justify-center">
          <v-row no-gutters class="align-start">
            <v-col cols="12" class="login-part d-flex align-center justify-center flex-column">
              <div class="login-wrapper pt-md-4 pt-0">
                <v-tabs grow>
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab :href="`#tab-login`">
                    LOGIN
                  </v-tab>

                  <v-tab-item :value="'tab-login'" >
                    <v-form>
                      <v-container>
                        <v-row class="flex-column">
                          <v-col>
                            <p class="login-slogan display-2 text-center font-weight-medium my-10">Good Morning, User</p>
                          </v-col>
                          <v-form>
                            <v-col>
                              <v-text-field
                                  v-model="username"
                                  :rules="emailRules"
                                  value="admin@flatlogic.com"
                                  label="Email Address"
                                  required
                              ></v-text-field>
                              <v-text-field
                                  v-model="password"
                                  :rules="passRules"
                                  type="password"
                                  label="Password"
                                  hint="At least 6 characters"
                                  required
                              ></v-text-field>

                            </v-col>
                            <v-col class="d-flex justify-space-between">
                              <v-btn
                                  class="text-capitalize"
                                  large
                                  :disabled="password.length === 0 || username.length === 0"
                                  color="primary"
                                  @click="login"
                              >
                                Login</v-btn>
                              <v-btn large text class="text-capitalize primary--text">Forget Password</v-btn>
                            </v-col>
                          </v-form>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-tab-item>

                </v-tabs>
              </div>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-footer>
                <div class="primary--text">版权所有 © 1996-2020 <a href="http://www.gdbtu.edu.cn/">广东工商职业技术大学</a>技术支持</div>
              </v-footer>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { postRequest } from '@/utils/request'
import system from '@/api/System'
  export default {
    name: 'Login',
    data() {
      return {
        username: 'admin',
        emailRules: [
          v => !!v || 'username is required'
        ],
        password: 'admin',
        passRules: [
          v => !!v || 'Password is required',
          v => v.length >= 5 || 'Min 5 characters'
        ]
      }
    },
    methods: {
      login(){
        postRequest(system.login, {
          username: this.username,
          password: this.password
        }).then(response => {
          if (response.code === 0) {
            localStorage.setItem('token', response.data.token)
            let info = {
              userId: response.data.id,
              username: response.data.username
            }
            localStorage.setItem('info', JSON.stringify(info))
            this.$router.push('/dashboard');
          } else {
            alert(response.msg)
          }
        })
      }
    }
  }

</script>

<style src="./Login.scss" lang="scss"/>
