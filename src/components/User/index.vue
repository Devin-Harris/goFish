<template>
  <div class="user">
    <div
      v-if="Boolean(message.message)"
      :class="user === 'Player' ? 'message-player' : 'message-computer'"
      class="message"
    >
      <div id="message-text">
        <p>{{ user }}:</p>
        <h1>{{ message.message }}</h1>
        <p id="found">{{ message.foundCards }}</p>
      </div>
    </div>
    <div class="info">
      <h5>{{ user }}</h5>
      <!--<h5>Remaining:&nbsp;{{ cardCount }}</h5>-->
      <div id="books">
        <h5>Books:&nbsp;{{ bookValues.length }}</h5>
        <div id="bookValues" v-if="bookValues.length > 0">
          <h6>(</h6>
          <p
            v-for="(book, index) in bookValues"
            :key="book"
          >{{ (index !== bookValues.length - 1) ? book + ',' : book}}</p>
          <h6>)</h6>
        </div>
      </div>
    </div>
    <div class="cards">
      <Card
        @cardClick="cardClick(card)"
        @redraw="redrawCards"
        ref="card"
        v-for="(card, index) in cards"
        :key="index"
        :user="user"
        :cardIndex="index"
        :card="cards[index]"
      />
    </div>
  </div>
</template>

<script src="./User.js"></script>
<style src="./User.scss" lang="scss"></style>
