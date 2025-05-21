<template>
  <div class="current" v-if="hasCurrent">
    <div v-on:click.prevent="remove(0)">{{ currentText }}</div>
    <div
      class="current-progress-background"
      v-on:click.prevent="toggleTimer"
    ></div>
    <div
      class="current-progress-foreground"
      v-on:click.prevent="toggleTimer"
      v-bind:style="{ width: missingTimePercentage + '%' }"
    ></div>
  </div>
  <div
    v-for="(name, index) in pending"
    v-bind:key="name"
    class="pending"
    :class="{hidden: hidePending}"
    v-on:click.prevent="remove(index + 1)"
  >
    <span>{{ name }}</span>
  </div>
  <div v-if="!hasCurrent" class="fin">{{ fin }}</div>
  <div v-if="addingElement" class="addElementPrompt">
    <label>Add person:</label>
    <input ref="newElementInput" type="text" v-model="newElement">
  </div>
  <div v-if="hasCurrent && showHelp" class="help">
    <table>
      <tr>
        <td><code>&lt;Space&gt;</code></td>
        <td>Toggle timer</td>
      </tr>
      <tr>
        <td><code>&lt;Backspace&gt;</code></td>
        <td>Remove first element</td>
      </tr>
      <tr>
        <td><code>&lt;Ctrl + A&gt;</code></td>
        <td>Add person</td>
      </tr>
      <tr>
        <td><code>&lt;Ctrl + H&gt;</code></td>
        <td>Toggle hidden names</td>
      </tr>
    </table>
  </div>
  <div v-if="hasCurrent && !showHelp" class="help">
    <table>
      <tr>
        <td><code>&lt;?&gt;</code></td>
        <td>Show keymap</td>
      </tr>
    </table>
  </div>
</template>

<script>
import moment from "moment";
import {ref} from "vue";

export default {
  name: "App",
  data: function () {
    return {
      duration: null,
      names: null,
      currentIndex: 0,
      running: false,
      now: moment(),
      fin: "So!",
      hidePending: false,
      showHelp: false,
      addingElement: false,
      newElement: "",
      newElementInput: ref(null),
      end: moment().subtract(1, "minutes"),
    };
  },
  created: function () {
    let urlSearchParams = new URLSearchParams(window.location.search);

    this.duration = moment.duration(urlSearchParams.get("duration") || 30000);

    const namesStr = urlSearchParams.get("names") || window.localStorage.getItem("names") || null;
    let names = namesStr ? namesStr.split(",") : [];

    this.hidePending = !!window.localStorage.getItem("hidePending");

    window.localStorage.setItem("names", names.join(","));

    for (let i = names.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = names[i];
      names[i] = names[j];
      names[j] = temp;
    }

    this.names = ref(names);

    setInterval(() => {
      if (this.running) {
        this.now = moment();
      }
    }, 10);
  },
  computed: {
    hasCurrent: function () {
      return this.currentIndex < this.names.length;
    },
    current: function () {
      return this.names[this.currentIndex];
    },
    currentText: function () {
      return this.running
        ? this.current +
            " has " +
            this.remainingTime.humanize({
              ss: 0,
              s: 60,
              m: 60,
            }) +
            " left"
        : this.current + " is next";
    },
    pending: function () {
      return this.names.slice(this.currentIndex + 1);
    },
    remainingTime: function () {
      return moment.duration(this.end.diff(moment.min(this.end, this.now)));
    },
    missingTimePercentage: function () {
      return this.running
        ? 100 -
            (this.remainingTime.asMilliseconds() * 100) /
              this.duration.asMilliseconds()
        : 0;
    },
  },
  watch: {
    remainingTime: function (newValue) {
      if (this.running && newValue.asMilliseconds() <= 0) {
        this.running = false;
        this.currentIndex = this.currentIndex + 1;
      }
    },
  },
  mounted: function() {
    document.addEventListener('keyup', this.onKeyUp);
  },
  beforeDestroy: function() {
    document.removeEventListener('keyup', this.onKeyUp);
  },
  methods: {
    onKeyUp: function (event) {
      if (this.addingElement) {
        switch (event.code) {
          case "Escape":
            this.cancelAddElement();
            break;
          case "Enter":
            this.finishAddElement();
            break;
        }
      } else {
        switch (event.code) {
          case "Space":
            this.toggleTimer();
            break;
          case "Backspace":
            this.remove(0);
            break;
          case "KeyA":
            if (event.ctrlKey) {
              this.startAddElement();
            }
            break;
          case "KeyH":
            if (event.ctrlKey) {
              this.hidePending = !this.hidePending;
              window.localStorage.setItem("hidePending", JSON.stringify(this.hidePending));
            }
            break;
          default:
            if (event.key === "?") {
              this.showHelp = !this.showHelp;
            }
        }
      }
    },
    startAddElement: async function () {
      this.addingElement = true;
      await this.$nextTick();
      this.$refs.newElementInput.focus();
    },
    cancelAddElement: async function () {
      this.addingElement = false;
      this.newElement = "";
    },
    finishAddElement: async function () {
      this.addingElement = false;
      if (this.newElement) {
        this.names.push(this.newElement);
        this.newElement = "";
      }
    },
    remove: function (index) {
      if (this.running && index === 0) {
        this.running = false;
      }
      this.names.splice(index, 1);
    },
    toggleTimer: function () {
      if (this.running) {
        this.running = false;
      } else {
        this.now = moment();
        this.end = moment(this.now).add(this.duration);
        this.running = true;
      }
    },
  },
};
</script>

<style>
body {
  background-color: #000000;
  margin: 0;
}

.current {
  margin: 0.5em;
  font-size: 1.5em;
  padding-top: 0.5em;
  text-align: center;
  border-radius: 1em;
  height: 3.5em;
  background-color: #d6ebc4;
  position: relative;
  overflow: hidden;
}

.current-progress-background {
  background-color: #a3ba49;
  position: absolute;
  bottom: 0;
  right: 0;
  height: 2em;
  width: 100%;
}

.current-progress-foreground {
  background-color: #8d0007;
  position: absolute;
  bottom: 0;
  right: 0;
  height: 2em;
}

.pending {
  margin: 0.5em;
  font-size: 1.5em;
  padding: 0.5em;
  text-align: center;
  border-radius: 1em;
  background-color: #d6ebc4;
}

.pending.hidden span {
  filter: blur(5px);
}

.fin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
  font-size: 7em;
}

.help {
  color: #666;
  font-family: "Helvetica", "Arial", sans-serif;
  font-size: 1em;
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 10px;
}

.help code {
  font-family: "Courier New", monospace;
  font-size: 1em;
}

.help td:first-child {
  text-align: right;
}

.addElementPrompt {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #49a6bc;
  padding: 16px;
  border-radius: 8px;
  font-family: "Helvetica", "Arial", sans-serif;
  font-size: 1.5em;
  display: flex;
  flex-direction: row;
  width: auto;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: stretch;
}

.addElementPrompt label {
  margin-right: 8px;
  white-space: nowrap;
  align-content: center;
}

.addElementPrompt input {
  background-color: #ffffff75;
  font-size: 1em;
  border-style: none;
  border-radius: 4px;
  flex: 1;
}

</style>
