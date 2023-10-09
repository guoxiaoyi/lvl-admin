<template>
  <div>
    <ScheduleTimeAble />
    <CustomPercentageVue />
  </div>
</template>

<script>
import CustomPercentageVue from './CustomPercentage.vue'
import ScheduleTimeAble from './ScheduleTimeAble.vue'
export default {
  inject: ['_award_form'],
  components: {
    CustomPercentageVue,
    ScheduleTimeAble
  }
}
</script>
