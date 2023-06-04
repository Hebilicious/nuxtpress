import type { RuntimeConfig } from "nuxt/schema"
import type Markdown from "vite-plugin-vue-markdown"

import shikiPlugin from "markdown-it-shiki"
import tablePlugin from "markdown-it-multimd-table"
import anchorPlugin from "markdown-it-anchor"
import attrsPlugin from "markdown-it-attrs"
import emojiPlugin from "markdown-it-emoji"

import { highlightLinePlugin } from "./md-it-plugins/highlightLines"
import { preWrapperPlugin } from "./md-it-plugins/preWrapper"
import { containerPlugin } from "./md-it-plugins/container"
import { lineNumberPlugin } from "./md-it-plugins/lineNumberPlugin"

export const NAME = "nuxtpress" as const
export const configKey = "nuxtPress" as const

export interface NuxtPressOptions {
  markdownPluginOptions: Parameters<typeof Markdown>[0]
}

export const defaults: NuxtPressOptions = {
  markdownPluginOptions: {
    wrapperClasses: "markdown-nuxtpress",
    headEnabled: true,
    include: [/\.md(\?.*)?$/],
    markdownItSetup(md) {
      md.use(shikiPlugin)
      md.use(highlightLinePlugin)
      md.use(preWrapperPlugin, { hasSingleTheme: true })
      md.use(containerPlugin, { hasSingleTheme: true })
      md.use(lineNumberPlugin)
      md.use(attrsPlugin)
      md.use(emojiPlugin)
      md.use(anchorPlugin)
      md.use(tablePlugin)
    }
  }
}

export function getNuxtPressOptions(config: RuntimeConfig) {
  return config.public[configKey]
}
