<template>
<div class="card-container" :class="(user === 'Player') ? `card-image-Player` : `card-image-Computer`">
    <img @click="cardClick" class="card-image" alt="card-image" />
</div>
</template>

<script src="./Card.js"></script>
<style src="./Card.scss" lang="scss" scoped></style>
