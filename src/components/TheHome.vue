<script setup lang="ts">
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import ModelTrainer from './ModelTrainer.vue'
import PlantSelector from './PlantSelector.vue'
import WrapperItem from './WrapperItem.vue'

</script>

<template>

  <WrapperItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <ModelTrainer/>
  </WrapperItem>


  <WrapperItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading><PlantSelector/></template>
    <br />
  </WrapperItem>

</template>
