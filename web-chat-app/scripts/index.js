document.querySelectorAll("chat-list-item")
    .forEach(i => {
        i.addEventListener("selected", (e) => {
            // i.setAttribute("disabled", "");
            console.log(e.detail);
            // i.disabled = true;
            // console.log(i.disabled);
            // if (e.target.getAttribute("online"))
            //     e.target.removeAttribute("online");
            // else
            //     e.target.setAttribute("online", true)
        })
    });

document.addEventListener("selected", (e)=>{
    console.log(e.detail);
})
