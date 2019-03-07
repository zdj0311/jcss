import router from '../router'
const state = {
  user:JSON.parse(window.localStorage.getItem('user'))
}

const mutations = {
  updateUser(state, data) {
    window.localStorage.setItem('user', JSON.stringify(data));
    state.user = JSON.parse(window.localStorage.getItem('user'));
  },
  signout(state) {
    router.replace('login')
    state.user = null;
    window.localStorage.removeItem('user');
  },
};

export default {
  namespaced: true,
  state,
  mutations
}