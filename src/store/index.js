import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    deckId: {
      type: String,
      default: null
    },
    deck: {
      type: Object,
      default: null
    },
    playerCards: {
      type: Array,
      default: null
    },
    computerCards: {
      type: Array,
      default: null
    },
    url: {
      type: String,
      default: null
    }
  },
  getters: {
    async getCards(user) {
      let res = await axios.get(`${this.$store.state.url}/pile/${user}/list`)
      let piles = res.data.piles
      return (user === 'Player') ? Array.from(piles.Player.cards) : Array.from(piles.Computer.cards)
    }
  },
  mutations: {
    setCards(user) {
      if (user === 'Player') {
        this.state.playerCards = this.getters.getCards(user)
      } else {
        this.state.computerCards = this.getters.getCards(user)
      }
    }
  },
  actions: {
  },
})
