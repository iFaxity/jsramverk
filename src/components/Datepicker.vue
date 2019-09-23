<template lang="pug">
.date-picker
  text-field(@focus="show", :value="formatValue", :label="label",
    :name="name", :required="required", readonly
  )
  transition
    .backdrop(v-if="open", @click="cancel", @touchend="cancel")
  transition
    .calendar(v-if="open")
      .header
        span.prev(@click="prev")
        span.title {{ title }}
        span.next(:class="{ disabled: !hasNext }", @click="next")
      .body
        .weekdays
          span.weekday(v-for="day in weekdays") {{ day }}
        .days
          .day.empty(v-for="_ in weekdayStart")
          .day(v-for="[ day, key ] in daysInMonth", :key="key",
            :class="{ selected: isSelected(day) }", @click="selectDay(day)", @touchend="selectDay(day)"
          )
            span {{ day }}
      .footer
        button(@click.prevent="cancel") AVBRYT
        button(@click.prevent="ok") OK
</template>

<style lang="scss" scoped>
$media-tablet: 768px;

.date-picker {
  position: relative;
}

// Transitions
.backdrop,
.calendar {
  &.v-enter-active, &.v-leave-active {
    transition: all 0.5s ease;
  }
  &.v-enter, &.v-leave-to {
    opacity: 0;
  }
}

.backdrop {
  position: fixed;
  display: none;
  background: #000;
  opacity: 0.8;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;

  @media (max-width: $media-tablet) {
    display: block;
  }
}

.input {
  position: relative;
  min-width: 100px;
  margin: 0.3em 0;
  width: 100%;
  color: #405863;
  height: 52px;

  input {
    background: #e6e6e6;
    font-size: 1em;
    padding: 1.5em 1em 0.5em;
    width: 100%;
    transition: border-color 0.2s ease, opacity 0.2s ease;
    border: none;
    border-bottom: 0.1em solid #8ea3ac;
    border-radius: 0.2em;
    outline: none;
    box-sizing: border-box;
    opacity: 0.5;

    &:hover {
      opacity: 0.8;
    }
    &:focus {
      border-color: #c60000;
      opacity: 1;
    }

    &:focus + label,
    &:not(:placeholder-shown) + label {
      color: #c60000;
      transform: translateY(-60%) scale(0.9);
      opacity: 1;
    }
  }

  label {
    position: absolute;
    top: 1em;
    left: 1em;
    opacity: 0.5;
    transition: transform 0.2s ease, opacity 0.2s ease, color 0.2s ease;
    will-change: transform, opacity, color;
    transform-origin: top left;
    pointer-events: none;
  }
}

.calendar {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  font-size: 1em;
  box-shadow: 0 0 0.5em 0.1em rgba(0, 0, 0, 0.4);
  user-select: none;
  background: #fff;
  z-index: 10;

  @media (max-width: $media-tablet) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -7.5em);
  }

  .header {
    position: relative;
    height: 1em;
    display: flex;
    color: #fff;
    background: #397eff;
    justify-content: center;
    align-items: center;
    padding: 0.7em 0.5em;

    .title {
      flex: 1;
      text-align: center;
    }

    .prev,
    .next {
      cursor: pointer;
      padding: 0.3em 0.5em 0.5em;
      position: absolute;

      &::before {
        content: '';
        border: solid #fff;
        border-width: 0 0.15em 0.15em 0;
        display: inline-block;
        padding: 0.25em;
        vertical-align: middle;
      }

      &.disabled {
        pointer-events: none;

        &::before {
          content: none;
        }
      }
    }

    .prev {
      left: 0.5em;

      &::before {
        transform: rotate(135deg);
      }
    }
    .next {
      right: 0.5em;

      &::before {
        transform: rotate(-45deg);
      }
    }
  }

  .body {
    padding: 0.2em 0.5em 0;

    .weekdays,
    .days {
      display: grid;
      grid-gap: 0.4em;
      grid-template-columns: repeat(7, 1fr);
    }

    .weekdays {
      color: #888;

      .weekday {
        text-align: center;
        padding: 0.4em 0.2em;
        box-sizing: border-box;
      }
    }

    .days {
      color: #333;

      .day {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.8em;
        height: 1.8em;
        padding: 0.2em;
        border-radius: 50%;
        transition: color 0.2s ease, background-color 0.2s ease;
        box-sizing: border-box;
        cursor: pointer;

        &.empty {
          cursor: initial;
        }
        &.selected {
          color: #fff;
          background-color: #397eff;
        }
      }
    }
  }

  .footer {
    padding: 0.5em 0;
    float: right;

    button {
      font-size: 0.9em;
    }
  }
}
</style>

<script>
import AppTextfield from './Textfield';

const MONTH_NAMES = [
  'JANUARI',
  'FEBRUARI',
  'MARS',
  'APRIL',
  'MAJ',
  'JUNI',
  'JULI',
  'AUGUSTI',
  'SEPTEMBER',
  'OKTOBER',
  'NOVEMBER',
  'DECEMBER',
];
const WEEKDAYS = [ 'M', 'T', 'O', 'T', 'F', 'L', 'S' ];

function formatDate(year, month, day) {
  year = year.toString().padStart(4, '0');
  month = (month + 1).toString().padStart(2, '0');
  day = day.toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default {
  name: 'AppDatepicker',
  components: { AppTextfield },
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    name: String,
    required: Boolean,
    value: {
      type: Date,
      default: () => new Date(),
    },
    label: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      weekdays: WEEKDAYS,
      open: false,
      transitioning: false,
      currentYear: this.value.getFullYear(),
      currentMonth: this.value.getMonth(),
      selected: new Date(this.value),
    };
  },
  computed: {
    daysInMonth() {
      // Get how many days in the current month
      const year = this.currentYear;
      const month = this.currentMonth + 1;
      const date = new Date(year, month, 0);
      let days = date.getDate();

      if (!this.hasNext) {
        const now = new Date();
        days = now.getDate();
      }

      return [...Array(days).keys()].map(day => [ day + 1, formatDate(year, month, day + 1) ]);
    },
    title() {
      const monthName = MONTH_NAMES[this.currentMonth];
      return `${monthName} ${this.currentYear}`;
    },
    weekdayStart() {
      // defaults to 0-6 as Sun-Sat, we want Mon-Sun as 0-6
      const date = new Date(this.currentYear, this.currentMonth, 1);
      const weekday = date.getDay();
      return weekday == 0 ? 6 : weekday - 1;
    },
    formatValue() {
      return formatDate(this.value.getFullYear(), this.value.getMonth(), this.value.getDate());
    },

    hasNext() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      return year > this.currentYear || (year == this.currentYear && month > this.currentMonth);
    },
  },

  methods: {
    next() {
      if (this.currentYear > this.maxYear) return;

      if (this.currentMonth >= 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    prev() {
      if (!this.currentMonth) {
        // Dont allow dates lower than 1 January 1970.
        if (this.currentYear < this.minYear) return;

        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    selectDay(day) {
      this.selected = new Date(this.currentYear, this.currentMonth, day);
    },
    isSelected(day) {
      return (
        this.currentYear == this.selected.getFullYear() &&
        this.currentMonth == this.selected.getMonth() &&
        day === this.selected.getDate()
      )
    },
    show() {
      if (!this.open) {
        this.currentYear = this.value.getFullYear();
        this.currentMonth = this.value.getMonth();
        this.selected = new Date(this.value);
        this.open = true;

        document.body.addEventListener('click', this.hide, false);
        document.body.addEventListener('touchstart', this.hide, false);
      }
    },
    hide(e) {
      if (!e || !this.$el.contains(e.target)) {
        this.open = false;
        debugger;

        document.body.removeEventListener('click', this.hide);
        document.body.removeEventListener('touchstart', this.hide);
      }
    },
    cancel(e) {
      this.hide();
    },
    ok(e) {
      // Emit a clone of the date object
      this.$emit('change', new Date(this.selected));
      this.hide();
    },
  },
};
</script>
