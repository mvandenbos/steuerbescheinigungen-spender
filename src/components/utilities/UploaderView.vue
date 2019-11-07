<template>
  <div>
    <input type="file" @change="handleFileChange" :accept="filetypes">
  </div>
</template>

<script>
export default {
  name: "UploaderView",
  props: {
    value: File,
    filetypes: {
      type: String,
      default: '*'
    },
    label: {
      type: String,
      default: "Datei hochladen"
    }
  },

  methods: {
    handleFileChange(e) {
      this.$emit("input", e.target.files[0]);
    }
  }
};
</script>

<style scoped>
</style>