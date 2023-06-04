import type { RuntimeConfig } from "nuxt/schema"
import type Markdown from "vite-plugin-vue-markdown"
import Shiki from "markdown-it-shiki"

export const NAME = "nuxtpress" as const
export const configKey = "nuxtPress" as const

export interface NuxtPressOptions {
  markdownPluginOptions: Parameters<typeof Markdown>[0]
}

export const defaults: NuxtPressOptions = {
  markdownPluginOptions: {
    wrapperClasses: "markdown",
    headEnabled: true,
    include: [/\.md(\?.*)?$/],
    markdownItSetup(md) {
      // https://prismjs.com/
      md.use(Shiki)
    }
  }
}

export function getNuxtPressOptions(config: RuntimeConfig) {
  return config.public[configKey]
}
