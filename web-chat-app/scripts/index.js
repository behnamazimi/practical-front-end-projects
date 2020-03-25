document.querySelectorAll("chat-list-item")
.forEach(i=>{
    i.addEventListener("clicked", (e)=>{

        e.target.setAttribute("title", "Nahi")
    })
})
