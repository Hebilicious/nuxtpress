import { addTemplate, addVitePlugin, defineNuxtModule, useLogger } from "@nuxt/kit"
import { defu } from "defu"
import Markdown from "vite-plugin-vue-markdown"
import { NAME, type NuxtPressOptions, configKey, defaults } from "./runtime/utils"

// @todo 1 : Use markdown renderer from vitepress
// @todo 2 : Support vitepress configuration features

export default defineNuxtModule<NuxtPressOptions>({
  meta: {
    name: NAME,
    configKey,
    compatibility: {
      nuxt: "^3"
    }
  },
  defaults,
  async setup(userOptions, nuxt) {
    const logger = useLogger(NAME)

    logger.info(`Adding ${NAME} module...`)

    // Add .md to nuxt extensions so nuxt can use .md files as pages ...
    nuxt.options.extensions = nuxt.options.extensions ?? []
    if (!nuxt.options.extensions.includes("md")) nuxt.options.extensions.push("md")

    const markdownPluginOptions = defu(
      defaults.markdownPluginOptions,
      userOptions.markdownPluginOptions
    )

    // Create Vite Markdown plugin
    const markdownPlugin = Markdown(markdownPluginOptions)
    addVitePlugin(markdownPlugin)

    // Add md support to the vite-plugin @vitejs/plugin-vue ...
    // Another hook is available in case this doesn't work 'vite:extendConfig'
    // "vite:configResolved" can be used to inspect the final config
    nuxt.hook("vite:extend", ({ config }) => {
      config.vue!.include = [/\.vue$/, /\.md$/]
      logger.info("Vue config extended ...", config.vue?.include)
    })

    // 4. Add types for Markdown components.
    const markdownTypes = "types/markdown.d.ts"

    addTemplate({
      filename: markdownTypes,
      getContents: () => `
      declare module '*.md' {
        import type { ComponentOptions } from 'vue'
        const Component: ComponentOptions
        export default Component
      }`
    })
    nuxt.hook("prepare:types", ({ references }) => {
      references.push({ path: markdownTypes })
    })

    logger.success(`Added ${NAME} module successfully.`)
  }
})
