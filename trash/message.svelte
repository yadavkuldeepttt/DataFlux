<!-- <script>
  import Eliza from "elizabot";
  import { beforeUpdate, afterUpdate } from "svelte";

  let div;
  let autoscroll;

  beforeUpdate(() => {
    autoscroll =
      div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
  });

  afterUpdate(() => {
    if (autoscroll) div.scrollTo(0, div.scrollHeight);
  });

  const eliza = new Eliza();

  let comments = [{ author: "eliza", text: eliza.getInitial() }];

  function handleKeydown(event) {
    if (event.key === "Enter") {
      const text = event.target.value;
      if (!text) return;

      comments = comments.concat({
        author: "user",
        text,
      });

      event.target.value = "";

      const reply = eliza.transform(text);

      setTimeout(
        () => {
          comments = comments.concat({
            author: "eliza",
            text: "...",
            placeholder: true,
          });

          setTimeout(
            () => {
              comments = comments
                .filter((comment) => !comment.placeholder)
                .concat({
                  author: "eliza",
                  text: reply,
                });
            },
            500 + Math.random() * 500
          );
        },
        200 + Math.random() * 200
      );
    }
  }
</script>

<div class="chat">
  <h1>Eliza</h1>

  <div class="scrollable" bind:this={div}>
    {#each comments as comment}
      <article class={comment.author}>
        <span>{comment.text}</span>
      </article>
    {/each}
  </div>

  <input
    on:keydown={handleKeydown}
    class="user-input"
    placeholder="Press enter key to send message"
  />
</div>

<style>
  .chat {
    display: flex;
    flex-direction: column;
    width: 30%;
    max-width: 100%;
    height: 60%;
    max-height: 100%;
    position: absolute;
    right: 2%;
    top: 12%;
    padding: 1rem;
    z-index: 999;
    background-color: #083d6a;
  }

  .scrollable {
    flex: 1 1 auto;
    border-top: 1px solid #eee;
    margin: 0 0 0.5em 0;
    overflow-y: auto;
  }
  .scrollable::-webkit-scrollbar {
    width: 5px;
  }

  .scrollable article {
    margin: 0.5em 0;
  }

  .user {
    text-align: right;
  }

  .scrollable span {
    color: black;
    padding: 0.5em 1em;
    display: inline-block;
  }

  .eliza span {
    background-color: #eee;
    border-radius: 1em 1em 1em 0;
  }

  .user span {
    background-color: #0074d9;
    color: white;
    border-radius: 1em 1em 0 1em;
  }
  .user-input {
    padding: 0.3rem;
    border-radius: 15px;
  }
</style> -->
