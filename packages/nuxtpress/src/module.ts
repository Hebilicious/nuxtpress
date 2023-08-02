import Markdown from "vite-plugin-vue-markdown"
import { addPlugin, addTypeTemplate, addVitePlugin, createResolver, defineNuxtModule, useLogger } from "@nuxt/kit"
import { defu } from "defu"
import { NAME, configKey, defaults } from "./runtime/utils"
import { highlight } from "./runtime/md-it-plugins/highlight"

// @todo 1 : Use custom @md-it vite plugin
// @todo 2 : Support @mdit-vue/plugin-sfc to extract styles and scripts from md files.

export interface ModuleOptions {
  markdownPluginOptions: Parameters<typeof Markdown>[0]
}

declare module "@nuxt/schema" {}

export default defineNuxtModule<ModuleOptions>({
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
    const { resolve } = createResolver(import.meta.url)

    logger.info(`Adding ${NAME} module...`)

    // Add .md to nuxt extensions so nuxt can use .md files as pages ...
    nuxt.options.extensions = nuxt.options.extensions ?? []
    if (!nuxt.options.extensions.includes("md")) nuxt.options.extensions.push("md")

    const markdownPluginOptions = defu(
      userOptions.markdownPluginOptions,
      {
        markdownPluginOptions: {
          markdownItOptions: {
            highlight: await highlight("material-theme-lighter")
          }
        }
      },
      defaults.markdownPluginOptions
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

    addTypeTemplate({
      filename: "types/markdown.d.ts",
      write: true,
      getContents: () => /* ts */`
      declare module '*.md' {
        import type { ComponentOptions } from 'vue'
        const Component: ComponentOptions
        export default Component
      }`
    })

    // 5. Add Nuxt Plugins.
    addPlugin(resolve("./runtime/plugins/copyCode"))

    logger.success(`Added ${NAME} module successfully.`)
  }
})
