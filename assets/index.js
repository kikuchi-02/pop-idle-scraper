["nogizaka", "sakurazaka", "hinatazaka"].forEach((kind) => {
  document
    .getElementById(`checkbox-${kind}`)
    .addEventListener("change", (event) => {
      const container = document.getElementById(`kind-container-${kind}`);
      console.log(container)
      if (event.target.checked) {
        container.setAttribute('style', "display: block;")
      } else {
        container.setAttribute('style', "display: none;")
      }
    });
});
