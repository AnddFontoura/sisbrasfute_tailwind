<template>
  <system-layout>
  <main>
    <div
      class="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            gap-4
            justify-items-center
          "
    >
      <div
        v-for="item in this.items"
        :key="item.key"
        class="
              w-full
              max-w-[160px]
            "
      >
        <!-- usa router-link se router existir, senão botão -->
        <component
          @click="go(item.to)"
          class="block"
        >
          <div
            class="
                  aspect-square
                  w-full
                  rounded-xl
                  shadow-sm
                  bg-white
                  dark:bg-slate-800
                  border
                  border-transparent
                  hover:shadow-md
                  transform
                  hover:-translate-y-1
                  transition
                  p-4
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                "
            :class="item.color"
            role="button"
            :aria-label="item.label"
          >
            <div
              class="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    bg-white/20
                    rounded-md
                  "
            >
                  <span
                    v-html="item.icon"
                    class="
                      w-6
                      h-6
                      text-white
                    "
                  >

                  </span>
            </div>
            <div
              class="
                    text-sm
                    font-semibold
                    text-slate-900
                    dark:text-slate-100
                    text-center
                  "
            >
              {{ item.label }}
            </div>
          </div>
        </component>
      </div>
    </div>
  </main>
  </system-layout>
</template>

<script>
import api from "@/services/api";
import StateSelect from "@/components/form/StateSelectComponent.vue"
import CitySelect from "@/components/form/CitySelectComponent.vue"
import systemLayout from "@/components/layouts/systemLayout.vue";

export default {
  name: "teamList",
  components: {CitySelect, StateSelect, systemLayout},

  data() {
    return {
      teams: {}
    }
  },
  computed: {
  },
  methods: {
    async getTeamsList() {
      this.loading = true;
      try {
        await api.post("/team/save", this.payload);
        this.$router.push("/team/list");
      } catch (err) {
        console.error(err);
        alert("Erro ao salvar time!");
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>
