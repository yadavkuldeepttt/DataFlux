<script>
  export let file;

  let isCollapsed = true; // State to manage the collapse/expand of the outline
  // sections array for outline
  let sections = {
    code: true,
    documentation: true,
    schema: true,
    examples: true,
    allDocs: true,
    logSchema: true,
  };

  function toggleSection(section) {
    sections[section] = !sections[section];
  }

  function toggleCollapse() {
    isCollapsed = !isCollapsed;
  }

  function truncateText(text, maxLength = 100) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
}
</script>

<div class="file-outline bg-gray-100 border-t border-gray-200">
  <!-- Header with Chevron and Ellipsis Icon -->
  <div class="flex items-center justify-between px-2 py-0 bg-gray-200">
    <button
      class="flex items-center text-xs font-semibold text-gray-700 hover:text-gray-900"
      on:click={toggleCollapse}
    >
      <i
        class="fa-solid {isCollapsed ? 'fa-chevron-right' : 'fa-chevron-down'}"
        style="font-size: 9px;"
      ></i>
      <span class="ml-2 tracking-[0.06rem]">Outline</span>
    </button>
    <!-- Dropdown Menu with Ellipsis Icon -->
    <div class="dropdown dropdown-end dropdown-top">
      <div tabindex="0" role="button" class="btn btn-ghost btn-xs py-0 hover:bg-transparent m-0 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 12h.01M12 12h.01M18 12h.01"
          />
        </svg>
      </div>
      <ul
        tabindex="0"
        class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li><a>Action 1</a></li>
        <li><a>Action 2</a></li>
        <li><a>Action 3</a></li>
      </ul>
    </div>
  </div>

  <!-- Outline Content -->
  {#if !isCollapsed}
    {#if file}
      <div class="outline-content overflow-auto h-[30vh] p-2">
        <!-- Code Section -->
        <div class="section mb-2">
          <button class="section-title" on:click={() => toggleSection('code')}>
            <i class="fa-solid {sections.code ? 'fa-chevron-down' : 'fa-chevron-right'}"></i>
            <span class="ml-2">Code</span>
          </button>
          {#if sections.code}
            <pre class="section-content"><code>{file.code}</code></pre>
          {/if}
        </div>

        <!-- Documentation Section -->
        <div class="section mb-2">
          <button class="section-title" on:click={() => toggleSection('documentation')}>
            <i class="fa-solid {sections.documentation ? 'fa-chevron-down' : 'fa-chevron-right'}"></i>
            <span class="ml-2">Documentation</span>
          </button>
          {#if sections.documentation}
            <div class="section-content" >{@html truncateText(file.docs, 150)}</div>
          {/if}
        </div>

        <!-- Schema Section -->
        {#if file.schema.length > 0}
          <div class="section mb-2">
            <button class="section-title" on:click={() => toggleSection('schema')}>
              <i class="fa-solid {sections.schema ? 'fa-chevron-down' : 'fa-chevron-right'}"></i>
              <span class="ml-2">Schema</span>
            </button>
            {#if sections.schema}
              <ul class="section-content">
                {#each file.schema as entry (entry.id)}
                  <li>
                    <strong class="text-gray-600">Input:</strong> {entry.input}<br />
                    <strong class="text-gray-600">Output:</strong> {entry.output}
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        {/if}

        <!-- Examples Section -->
        {#if file.example.length > 0}
          <div class="section mb-2">
            <button class="section-title" on:click={() => toggleSection('examples')}>
              <i class="fa-solid {sections.examples ? 'fa-chevron-down' : 'fa-chevron-right'}"></i>
              <span class="ml-2">Examples</span>
            </button>
            {#if sections.examples}
              {#each file.example as ex (ex.input)}
                <div class="section-content mb-2 p-2 border border-gray-200 rounded">
                  <p><strong class="text-gray-600">Input:</strong> {ex.input}</p>
                  <p><strong class="text-gray-600">Output:</strong> {ex.output}</p>
                  <p><strong class="text-gray-600">Explanation:</strong> {ex.explanation}</p>
                  {#if ex.logs.length > 0}
                    <div class="mt-2">
                      <strong class="text-gray-600">Logs:</strong>
                      <ul>
                        {#each ex.logs as log (log.id)}
                          <li>
                            <strong class="text-gray-600">Timestamp:</strong> {log.timestamp}<br />
                            <strong class="text-gray-600">Message:</strong> {log.message}
                          </li>
                        {/each}
                      </ul>
                    </div>
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        {/if}

        <!-- AllDocs Section -->
        {#if file.allDocs.length > 0}
          <div class="section mb-2">
            <button class="section-title" on:click={() => toggleSection('allDocs')}>
              <i class="fa-solid {sections.allDocs ? 'fa-chevron-down' : 'fa-chevron-right'}"></i>
              <span class="ml-2">All Documentation</span>
            </button>
            {#if sections.allDocs}
              {#each file.allDocs as doc (doc.name)}
                <div class="section-content mb-2 p-2 border border-gray-200 rounded">
                  <p><strong class="text-gray-600">Name:</strong> {doc.name}</p>
                  <p><strong class="text-gray-600">Docs:</strong> {doc.docs}</p>
                  {#if doc.drawing}
                    <p><strong class="text-gray-600">Drawing:</strong></p>
                    <img src={doc.drawing} alt="Drawing" class="w-full h-auto mt-1" />
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        {/if}

        <!-- Log Schema Section -->
        {#if file.logSchema.length > 0}
          <div class="section mb-2">
            <button class="section-title" on:click={() => toggleSection('logSchema')}>
              <i class="fa-solid {sections.logSchema ? 'fa-chevron-down' : 'fa-chevron-right'}"></i>
              <span class="ml-2">Log Schema</span>
            </button>
            {#if sections.logSchema}
              {#each file.logSchema as log (log.id)}
                <div class="section-content mb-2 p-2 border border-gray-200 rounded">
                  <p><strong class="text-gray-600">Timestamp:</strong> {log.timestamp}</p>
                  <p><strong class="text-gray-600">Message:</strong> {log.message}</p>
                </div>
              {/each}
            {/if}
          </div>
        {/if}
      </div>
    {:else}
      <p class="text-gray-500 text-xs p-2">Select a file to view details.</p>
    {/if}
  {/if}
</div>

<style>
  .file-outline {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    border-radius: 6px;
  }

  .section {
    border-left: 2px solid #4a5568;
    padding-left: 8px;
  }

  .section-title {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: bold;
    color: #4a5568;
    cursor: pointer;
  }

  .section-content {
    padding-left: 16px;
    font-size: 12px;
  }

  .dropdown .btn {
    padding: 0;
    min-height: 0;
  }
  .btn {
    min-height: 1.4rem !important;
    height: 1rem !important;
}
</style>
