new Vue({
    el: '#app',
    data: {
        duration: null,
        names: null,
        currentIndex: 0,
        running: false,
        now: moment(),
        end: moment().subtract(1, 'minutes')
    },
    created: function() {
        let urlSearchParams = new URLSearchParams(window.location.search);

        this.duration = moment.duration(urlSearchParams.get('duration'));

        let names = urlSearchParams.get('names').split(',');

        for (let i = names.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = names[i];
            names[i] = names[j];
            names[j] = temp;
        }

        this.names = names;

        var self = this;
        setInterval(function() {
            if (self.running) {
                self.now = moment();
            }
        }, 10);
    },
    computed: {
        hasCurrent: function() {
            return this.currentIndex < this.names.length;
        },
        current: function() {
            return this.names[this.currentIndex];
        },
        currentText: function() {
            return this.running ? this.current + ' has ' + this.remainingTime.humanize({
                ss: 0,
                s: 60,
                m: 60
            }) + ' left' : this.current + ' is next';
        },
        pending: function() {
            return this.names.slice(this.currentIndex + 1);
        },
        remainingTime: function() {
            return moment.duration(this.end.diff(moment.min(this.end, this.now)));
        },
        missingTimePercentage: function() {
            return this.running ? 100 - this.remainingTime.asMilliseconds() * 100 / this.duration.asMilliseconds() : 0;
        }
    },
    watch: {
        remainingTime: function(newValue) {
            if (this.running && newValue.asMilliseconds() <= 0) {
                this.running = false;
                this.currentIndex = this.currentIndex + 1;
            }
        }
    },
    methods: {
        remove: function(index) {
            if (this.running && index === 0) {
                this.running = false;
            }
            this.names.splice(index, 1);
        },
        toggleTimer: function() {
            if (this.running) {
                this.running = false;
            }
            else {
                this.now = moment();
                this.end = moment(this.now).add(this.duration);
                this.running = true;
            }
        }
    },
    template: `
        <div>
            <div
                class="current"
                v-if="hasCurrent">
                <div v-on:click.prevent="remove(0)">{{ currentText }}</div>
                <div
                    class="current-progress-background"
                    v-on:click.prevent="toggleTimer"></div>
                <div
                    class="current-progress-foreground"
                    v-on:click.prevent="toggleTimer"
                    v-bind:style="{ width: missingTimePercentage + '%' }"></div>
            </div>
            <div
                v-for="(name, index) in pending"
                class="pending"
                v-on:click.prevent="remove(index + 1)">{{ name }}
            </div>
            <div v-if="!hasCurrent" class="fin">Fin</div>
        </div>
    `
});