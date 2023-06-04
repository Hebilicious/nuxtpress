# Using Vue in Markdown

In nuxtpress, each Markdown file is compiled into HTML and then processed as a [Vue Single-File Component](https://vuejs.org/guide/scaling-up/sfc.html). This means you can use any Vue features inside the Markdown, including dynamic templating, using Vue components, or arbitrary in-page Vue component logic by adding a `<script>` tag.

It's worth noting that nuxtpress leverages Vue's compiler to automatically detect and optimize the purely static parts of the Markdown content. Static contents are optimized into single placeholder nodes and eliminated from the page's JavaScript payload for initial visits. They are also skipped during client-side hydration. In short, you only pay for the dynamic parts on any given page.


<script setup>
import { ref } from 'vue'
const myRef = ref(0)
console.log("hello world", myRef)
</script>

Count is {{ myRef }}
<button v-for="i in 3" @click="myRef++">Increment</button>


:::tip SSR Compatibility
All Vue usage needs to be SSR-compatible. See [SSR Compatibility](./ssr-compat) for details and common workarounds.
:::

## Templating

### Interpolation

Each Markdown file is first compiled into HTML and then passed on as a Vue component to the Vite process pipeline. This means you can use Vue-style interpolation in text:

**Input**

```md
{{ 1 + 1 }}
```

**Output**

<div class="language-text"><pre><code>{{ 1 + 1 }}</code></pre></div>


### Directives

Directives also work (note that by design, raw HTML is also valid in Markdown):

**Input**

```html
<span v-for="i in 3">{{ i }}</span>
```

**Output**

<div class="language-text"><span v-for="i in 3">{{ i }}</span></div>