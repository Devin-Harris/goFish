export default {
    name: 'Card',
    props: {
        user: "",
        cardIndex: null,
        card: {}
    },
    methods: {
        cardClick() {
            this.$emit('cardClick', this.card)
        }
    },
    mounted() {
        this.$emit('redraw')
    }
}