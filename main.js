console.log("OSG202")

const log = console.log;

function preProcess(str) {
    str = str.replaceAll("(?m)^[ \t]*\r?\n", "");
    return str;
}

function verify(stack) {
    for (let s of stack) {
        if (s.chs.length < 4) console.log(s)
    }
}

function postProcess(stack) {
    for (let s of stack) {
        if ((s.ans == 6 || s.ans == 20) && s.chs.length == 0) {
            s.chs.push("T", "F")
            if (s.ans == 6) s.ans = 2;
            if (s.ans == 20) s.ans = 1;
        }
        while (s.chs.length < 5) {
            s.chs.push("");
        }
    }
}

function parse(file) {
    return new Promise((resolve, reject) => {
        fetch(file).then(buff => buff.text()).then(text => {

            let stack = [];

            text = preProcess(text);

            let questions = text.split("<question>");
            let matchAns = new RegExp(/^(\[[A-F]\])|^([A-F]\))|^([A-F]\.)|^([A-F]\/)/m, "m");

            for (let q of questions) {
                let quest = q.split("<answer>");
                let chs = quest[1].split("\r\n");

                let pack = {
                    ask: "",
                    typ: "Multiple Choice",
                    chs: [],
                    ans: quest[0].trim().toLowerCase().charCodeAt(0) - 96,
                    tim: 120
                }

                for (let a of chs) {
                    if (matchAns.test(a.toUpperCase().trim())) {
                        pack.chs.push(a);
                    } else {
                        pack.ask += a;
                    }
                }

                stack.push(pack)

            }

            resolve(stack);
        })
    })
}

/*
fetch("json.json").then(data => data.json()).then(stack1 => {
    let ss = [];
    let t = 0;
    let f = 0;
    for (let s of stack1) {
        let div = document.createElement("div");
        div.className = "ask";
        div.innerHTML = `
        <p>${s.ask}</p>
            <ul>
                <li>${s.chs[s.ans - 1]}</li>
            </ul>
        `
        document.getElementById("container").appendChild(div);
        if (s.chs[0] == "T" || s.chs[1] == "T") {
            ss.push({
                Question: s.ask,
                Answer: s.chs[s.ans - 1]
            })
            if (s.chs[s.ans - 1] == "T") t++; else f++
        }
    }
    console.log(JSON.stringify(ss))
    log(ss.length)
    log("f: " + f)
    log("t: " + t)
})
*/

fetch("quizz.txt").then(t => t.text()).then(t => {
    for (let r of t.split("<row>")) {
        let q = r.split("<term>")[0];
        let d = r.split("<term>")[1];
        let div = document.createElement("div");
        div.className = "ask";
        div.innerHTML = `
        <p>${q}</p>
            <ul>
                <li>${d}</li>
            </ul>
        `
        document.getElementById("container").appendChild(div);
    }
})

function search(t) {
    if (t.value.length > 1) {
        for (let x of document.getElementsByClassName("ask")) {
            if (x.textContent.toLowerCase().indexOf(t.value.toLowerCase()) > -1) {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }
        }
    } else {
        for (let x of document.getElementsByClassName("ask")) {
            x.style.display = "block";
        }
    }
}

window.onload = function () {
    for (let i = 65; i < 65 + 26; i++) {
        let span = document.createElement("span");
        span.textContent = String.fromCharCode(i);
        span.className = "xxx";
        span.onmouseup = e => {
            document.getElementById("inp").value += String.fromCharCode(i);
            search(document.getElementById("inp"));
        }
        document.getElementById("text").appendChild(span)
    }
    let span = document.createElement("span");
    span.textContent = "[space]";
    span.className = "xxx";
    span.onmouseup = e => {
        document.getElementById("inp").value += " ";
        search(document.getElementById("inp"));
    }
    document.getElementById("text").appendChild(span)
}

window.oncontextmenu = (e) => {
    e.preventDefault();
    document.getElementById("inp").value = document.getElementById("inp").value.slice(0, -1);
    search(document.getElementById("inp"));
}