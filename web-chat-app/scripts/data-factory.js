const names = ["Mario Speedwagon", "Petey Cruiser", "Anna Sthesia", "Paul Molive", "Anna Mull", "Gail Forcewind", "Paige Turner", "Bob Frapples", "Walter Melon", "Nick R. Bocker", "Barb Ackue", "Buck Kinnear", "Greta Life", "Ira Membrit", "Shonda Leer", "Brock Lee", "Maya Didas", "Rick O'Shea", "Pete Sariya", "Monty Carlo", "Sal Monella", "Sue Vaneer", "Cliff Hanger", "Barb Dwyer", "Terry Aki", "Cory Ander", "Robin Banks", "Jimmy Changa", "Barry Wine", "Wilma Mumduya", "Buster Hyman", "Poppa Cherry", "Zack Lee", "Don Stairs", "Saul T. Balls", "Peter Pants", "Hal Appeno", "Otto Matic", "Moe Fugga", "Graham Cracker", "Tom Foolery", "Al Dente", "Bud Wiser", "Polly Tech", "Holly Graham", "Frank N. Stein", "Cam L. Toe", "Pat Agonia", "Tara Zona", "Barry Cade"]

function randomDate() {
    const start = 1585008324467;
    const end = new Date().getTime();

    let date = new Date(+start + Math.random() * (end - start));
    let hour = randomNumber(24, 1);
    date.setHours(hour);
    return date;
}

export function randomNumber(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function chatGenerator(index) {
    const name = names[index];
    let lastseen = randomDate().toLocaleDateString().replace(/\//g, ".");
    if (index % 3 === 0)
        lastseen = "Today";
    if (index % 4 === 0)
        lastseen = "Yesterday";

    return {
        id: Math.random().toString(32).substr(2, 10),
        name,
        username: name.replace(/[^a-zA-Z]/g, '').toLowerCase().substr(0, 8),
        online: Math.random() > .7,
        lastseen,
        unreadcount: "0",
        avatar: `https://randomuser.me/api/portraits/${index % 2 ? "women" : "men"}/${index + 1}.jpg`,
    }
}
