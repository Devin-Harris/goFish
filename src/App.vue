<template>
<div id="app">
  <!--<Heading @load="gameLoaded" />-->
  <div id="users" v-if="usersVisible && !gameOver">
    <User v-for="(user, index) in users" :key="index" :user="user" :gameOverVar="gameOverVar" :message="user === 'Player' ? messageObjectplayer : messageObjectcomputer" @newMessage="newMessage" @cardChange="cardChange" @GameOver="GameOver" :isCardExchange="isCardExchange" />
  </div>

  <div id="gameOver" v-if="gameOver">
    <div id="btn-container">
      <h1>Game Over!</h1>
      <button @click="reload">play again...</button>
    </div>

    <div id="game-text-container">
      <div class="game-text">
        <p>Player</p>
        <p>Books: {{playerBooks.length}}</p>
      </div>
      <div class="game-text">
        <p>Computer </p>
        <p>Books: {{computerBooks.length}}</p>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import Heading from "./components/Heading";
import User from "./components/User";
import axios from "axios";
export default {
  name: "App",
  components: {
    Heading,
    User
  },
  data() {
    return {
      users: ["Player", "Computer"],
      usersVisible: false,
      isCardExchange: false,
      messageObjectplayer: {},
      messageObjectcomputer: {},
      gameOver: false,
      playerBooks: [],
      computerBooks: [],
      gameOverVar: false
    };
  },
  methods: {
    gameLoaded() {
      this.usersVisible = true;
    },
    GameOver(user, booksArr) {
      this.gameOverVar = true
      if (user === 'Player') {
        this.playerBooks = booksArr
      } else {
        this.computerBooks = booksArr
      }

      if (this.playerBooks.length > 0 && this.computerBooks.length > 0) {
        this.gameOver = true
      }
    },
    async reload() {
      this.users = ["Player", "Computer"]
      this.usersVisible = false
      this.isCardExchange = false
      this.messageObjectplayer = {}
      this.messageObjectcomputer = {}
      this.gameOver = false
      this.playerBooks = []
      this.computerBooks = []
      this.gameOverVar = false

      let response = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );

      let deck = response.data;
      this.$store.state.deck = deck;

      let deckId = deck.deck_id;
      this.$store.state.deckId = deckId;

      this.$store.state.url = `https://deckofcardsapi.com/api/deck/${this.$store.state.deckId}`;

      this.gameLoaded();
    },
    cardChange() {
      this.isCardExchange = !this.isCardExchange;
    },
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async newMessage(talkingUser, message, foundCards) {
      if (talkingUser === "Player") {
        this.messageObjectplayer = {
          talkingUser: talkingUser,
          message: message,
          foundCards: foundCards
        }
      } else {
        this.messageObjectcomputer = {
          talkingUser: talkingUser,
          message: message,
          foundCards: foundCards
        }
      }
      await this.delay(2000);
      if (this.messageObjectcomputer && this.messageObjectplayer) {
        this.messageObjectplayer = {};
        this.messageObjectcomputer = {};
      }
    }
  },
  async mounted() {
    this.reload()
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  background-color: $main-red;
  overflow-x: hidden;
}

@font-face {
  font-family: "Ocra";
  src: url("./assets/OCRAEXT.TTF");
}

#app {
  font-family: Ocra, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#gameOver {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: $main-red;
  color: $light-grey;

  #btn-container {
    font-size: 2rem;
    width: 80vw;
    border: 3px solid $light-grey;
    padding: 4rem 10rem;
    border-radius: 2rem;

    h1 {
      width: 30vw;
      height: 5rem;
      font-weight: 500;
      margin: 0 auto;
    }

    button {
      outline: none;
      font-family: Ocra;
      font-size: 2rem;
      margin: 0 auto;
      border: 0;
      background-color: $light-grey;
      color: $main-red;
      width: 30vw;
      height: 5.5rem;
      border-radius: 1rem;
      transition: .3s;

      &:hover {
        background-color: $light-red;
        color: $main-red;
        cursor: pointer;
      }
    }
  }

  #game-text-container {
    \
 margin: 2rem 0;
    width: 30vw;

    .game-text {
      margin: 1rem 0;
      display: flex;
      justify-content: space-between;
    }
  }
}

#users {
  margin: 0;
  min-height: 100vh;
  height: max-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.message {
  position: absolute;

  h1 {
    font-size: 2rem;
    color: white;
  }
}

.player-message {
  top: 10%;
  left: 10%;
}

.computer-message {
  bottom: 10%;
  right: 10%;
}
</style>
