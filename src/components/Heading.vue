<template>
  <div v-if="!(gameLoaded)" id="heading_container">
    <div id="heading-text">
      <h1>GO FISH!!!</h1>
    </div>
    <div id="button-container">
      <i @click="playClick" class="fas fa-fish"></i>
      <p @click="playClick">^ Click to play ^</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      gameLoaded: false
    };
  },
  methods: {
    async playClick() {
      let response = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );

      let deck = response.data;
      this.$store.state.deck = deck;

      let deckId = deck.deck_id;
      this.$store.state.deckId = deckId;

      this.$store.state.url = `https://deckofcardsapi.com/api/deck/${this.$store.state.deckId}`;

      this.$emit("load");
      this.gameLoaded = true;
    }
  }
};
</script>

<style lang="scss" scoped>
#heading_container {
  width: 100%;
  height: 100vh;
  background-color: $dark-red;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: "Arial Narrow Bold", sans-serif;

  #heading-text {
    margin: 2rem;

    h1 {
      font-weight: 900;
      font-size: 3rem;
      line-height: 100%;
      margin: 0.5rem 0;
    }
  }

  #button-container {
    margin: 2rem;

    i {
      font-size: 4rem;
      color: $light-grey;
      transition: 0.3s;

      &:hover {
        cursor: pointer;
        color: $light-red;

        ~ p {
          color: $light-red;
        }
      }
    }

    p {
      font-size: 0.5rem;
      line-height: 50%;
      transition: 0.3s;

      &:hover {
        cursor: pointer;
        color: $light-red;

        ~ i {
          color: $light-red;
        }
      }
    }
  }
}
</style>
