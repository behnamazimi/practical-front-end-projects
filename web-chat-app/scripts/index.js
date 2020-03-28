document.querySelectorAll("chat-list-item")
    .forEach(i => {
        i.on("selected", (e) => {

            // unselect other items
            document.querySelectorAll("chat-list-item")
                .forEach(i => i.shadowRoot.host.selected = false);

            console.log(e.detail);
            console.log(e);
            // e.target.disabled = true;
        })
    });
