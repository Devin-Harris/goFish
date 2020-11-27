import axios from "axios"
import Card from "@/components/Card"
import Blank from '@/assets/Blank.png'

export default {
    name: 'User',
    components: {
        Card
    },
    props: {
        user: "",
        isCardExchange: false,
        message: {
            type: Object,
            default: null
        },
        gameOverVar: false
    },
    data() {
        return {
            cards: [],
            currCard: {},
            cardCount: 7,
            bookValues: [],
        }
    },
    methods: {
        async cardClick(card) {
            if (this.user === 'Computer' && (!(this.isCardExchange))) return
            if (this.user === 'Player') {
                let images = document.querySelectorAll('.card-image')
                images.forEach(image => {
                    image.style.pointerEvents = 'none'
                })
            }
            let opponent = (this.user === 'Computer') ? 'Player' : 'Computer'
            let opponentCards = await this.getCards(opponent)

            let res_message = ""
            let foundCards = ""

            let values = this.findValues(card, opponentCards)

            if (values.length > 0) {
                let codes = ""
                for (let i = 0; i < values.length; i++) {
                    if (codes !== "") {
                        codes = `${codes},${values[i].code}`
                        foundCards = `${foundCards},  ${values[i].value} ${values[i].suit}`
                    } else {
                        codes = `${values[i].code}`
                        foundCards = `${values[i].value} ${values[i].suit}`
                    }
                }

                await axios.get(`${this.$store.state.url}/pile/${opponent}/draw/?cards=${codes}`)
                await axios.get(`${this.$store.state.url}/pile/${this.user}/add/?cards=${codes}`)

                res_message = `Nice catch!!!`
            } else {
                await this.drawCard()
                res_message = `Go fish!`
                foundCards = `No ${card.value}'s`
            }

            this.cards = await this.getCards(this.user)
            if (this.user === 'Player') {
                let images = document.querySelectorAll('.card-image')
                images.forEach(image => {
                    image.style.pointerEvents = 'none'
                })
            }
            this.bookCheck()

            this.$emit('newMessage', opponent, res_message, foundCards)
            await this.delay(2000)

            this.$emit('cardChange')
            if (this.user === 'Computer') {
                let images = document.querySelectorAll('.card-image')
                images.forEach(image => {
                    image.style.pointerEvents = 'all'
                })
            }
        },
        findValues(card, opponentCards) {
            let values = opponentCards.filter(value => value.value === card.value)
            return values
        },
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        },
        async bookCheck() {
            let object = {}
            let result = []

            this.cards.forEach((card, i) => {
                let cardValue = card.value
                if (!(object[cardValue])) {
                    object[cardValue] = []
                    object[cardValue][0] = 0
                    object[cardValue][1] = []
                }
                object[cardValue][0] += 1
                object[cardValue][1].push(i)
            })

            for (const prop in object) {
                if (object[prop][0] === 4) {
                    result.push(object[prop])
                    this.bookValues.push(prop)
                }
            }

            let indexs = []
            if (this.bookValues.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    indexs.push(...result[i][1])
                    indexs = [...indexs]
                }
                if (result.length > 0) {
                    await this.removeBooks(indexs)
                }
            }


        },
        async removeBooks(indexs) {
            let temp = []
            let codes = ""
            let toRemove = false
            for (let i = 0; i < this.cards.length; i++) {
                toRemove = false
                for (let j = 0; j < indexs.length; j++) {
                    if (i === indexs[j]) {
                        toRemove = true
                    }
                }

                if (!(toRemove)) {
                    temp.push(this.cards[i])
                } else {
                    if (codes !== "") {
                        codes = `${codes},${this.cards[i].code}`
                    } else {
                        codes = `${this.cards[i].code}`
                    }
                }
            }

            await this.delay(500)
            await axios.get(`${this.$store.state.url}/pile/${this.user}/draw/?cards=${codes}`)
            this.cards = await this.getCards(this.user)

        },
        async getCards(user) {
            let res = await axios.get(`${this.$store.state.url}/pile/${user}/list`)
            let piles = res.data.piles
            return (user === 'Player') ? Array.from(piles.Player.cards) : Array.from(piles.Computer.cards)
        },
        redrawCards() {
            let images = document.querySelectorAll(`.card-image-${this.$props.user}`)
            if (images) {
                for (let i = 0; i < this.cards.length; i++) {
                    if (this.user === 'Player') {
                        images[i].children[0].src = this.cards[i].images.png
                    } else {
                        images[i].children[0].src = Blank
                    }
                }
            }
        },
        async showCard(cardToFind) {
            let index = null
            this.cards.forEach((card, i) => {
                if (card === cardToFind) {
                    index = i
                }
            })

            let images = document.querySelectorAll(`.card-image-${this.user}`)
            if (images.length > 0) {
                images[index].children[0].src = this.cards[index].images.png
            }
            await this.delay(3000)
            this.cardShowing = false
        },
        async drawCard() {
            let res = await axios.get(`${this.$store.state.url}/draw/?count=1`)
            let cardCode = res.data.cards[0].code
            await axios.get(`${this.$store.state.url}/pile/${this.user}/add/?cards=${cardCode}`)
            this.cards = await this.getCards(this.user)
        },
        gameOver() {
            this.$emit('GameOver', this.user, this.bookValues)
        }
    },
    async mounted() {
        let response = await axios.get(`${this.$store.state.url}/draw/?count=${this.cardCount}`)
        let data = response.data
        let codes = ""
        data.cards.forEach((card, index) => {
            if (index !== 0) {
                codes = `${codes},${card.code}`
            } else {
                codes = `${card.code}`
            }
        })

        await axios.get(`${this.$store.state.url}/pile/${this.$props.user}/add/?cards=${codes}`)
        this.cards = await this.getCards(this.user)

        this.bookCheck()
    },
    watch: {
        async cards() {
            this.cardCount = this.cards.length
            this.redrawCards()
        },
        async isCardExchange() {
            this.cards = await this.getCards(this.user)
            await this.delay(200)
            if (this.cardCount === 0) {
                let res = await axios.get(this.$store.state.url)
                if (res.data.remaining >= 1 && !this.gameOverVar) {
                    await this.drawCard()
                } else {
                    this.gameOver()
                }
            }
            if (this.isCardExchange) {
                if (this.user === 'Computer') {
                    let card = this.cards[Math.floor(Math.random() * this.cards.length)]
                    await this.delay(500)
                    this.showCard(card)
                    await this.delay(1000)
                    await this.cardClick(card)
                }
            }
        }
    }
}