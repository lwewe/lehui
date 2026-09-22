<template>
<div>
  <!--  tabbar-->
  <NavigationTab :active="3"></NavigationTab>
</div>
</template>
<script>
import NavigationTab from "@/components/NavigationTab.vue";

export default {
  name: "Freeca",
  components: {NavigationTab}
}
</script>

<style scoped>

</style>