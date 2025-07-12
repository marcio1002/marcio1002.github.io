(function () {
    const messages = [
        [
            `Oi, minha princesa!`,
            `Quero que você saiba o quanto estou apaixonado por você. Cada detalhe seu me encanta: o jeito como você fala, seu sorriso, sua leveza, e esse seu jeitinho meigo que me fascina cada dia mais.`,
        ],
        [
            `Você é uma mulher forte, daquelas raras. Mesmo com os desafios da vida, nunca deixou que isso mudasse a sua essência. Continua sendo doce, amorosa e cheia de luz.`,
        ],
        [
            `Já conheci pessoas que deixaram a dor endurecer o coração… Mas você, não. Mesmo com suas batalhas, nunca deixou de cuidar dos seus filhos com amor. Isso só me faz te admirar mais e mais.`,
        ],
        [`Minha princesa ❤️`],
    ];

    const music1 = new Audio("music/musica-1.mp3");
    const music2 = new Audio("music/musica-2.mp3");
    music1.volume = 0.1;
    music2.volume = 0.1;

    const envelop = document.querySelector(".envelop");
    const sticker = document.querySelector(".js-sticker");
    const upPaper = document.querySelector(".js-up-paper");
    const size_tablet_or_smaller = window.matchMedia("(max-width: 769px)");
    const mobile_media_query = window.matchMedia("(max-width: 400px)");
    const tablet_media_query = window.matchMedia("(min-width: 400px) and (max-width: 600px)");
    let notes = document.querySelectorAll(".js-note");

    function resize_notes() {
        notes.forEach((note) => {
            if (!note.classList.contains("active")) return;

            note.classList.remove("active");
            gsap.set(note, { height: "30%", clearProps: "all" });
        });
    }

    function add_notes() {
        const offset = 15; // distância vertical entre notas
        const base = 20; // posição da primeira nota (mais embaixo)

        messages.forEach((Ps, index) => {
            const elemPs = Ps.map((m) => `<p>${m}</p>`).join("\n");

            const note = document.createElement("div");
            note.classList.add("note", "js-note");
            note.style.bottom = `${base + offset * (messages.length - 1 - index)}%`;
            note.style.zIndex = 100 + index;
            note.innerHTML = `
                    <div class="note__text">
                        ${elemPs}
                    </div>
                    `;

            document.querySelector(".love-notes").append(note);
        });

        notes = document.querySelectorAll(".js-note");
    }

    /**
     *
     * @param {HTMLAudioElement} audio
     */
    function play_music_with_fade(audio) {
        let vol_current = audio.volume;
        const vol_end = 0.6;
        const temp_fade = 8000;
        const increment = 0.01;
        const vol_interval = temp_fade / ((vol_end - vol_current) / increment);

        const fadeIn = setInterval(() => {
            if (vol_current < vol_end) {
                vol_current = Math.min(vol_current + increment, vol_end);
                audio.volume = vol_current;
            } else {
                clearInterval(fadeIn);
            }
        }, vol_interval);

        audio.play();
    }

    /**
     *
     * @param {HTMLDivElement} note
     * @param {number} height
     */
    function show_node(note, height) {
        notes.forEach((n) => {
            if (!n.classList.contains("active")) return;

            n.classList.remove("active");
            gsap.set(n, {
                height: "30%",
            });
        });

        note.classList.add("active");
        gsap.set(note, { height: `${height}%` });
    }

    /**
     *
     * @param {HTMLDivElement} note
     */
    function hide_node(note) {
        note.classList.remove("active");

        gsap.set(note, { height: "30%" });
    }

    /**
     *
     * @param {HTMLDivElement} note
     * @param {number} index
     */
    function show_or_hide_note(note, index) {
        if (!envelop.classList.contains("open")) return;

        /**
         *
         * @param {number} height
         * @returns
         */
        const toggle_node = (height) =>
            note.classList.contains("active") ? hide_node(note) : show_node(note, height);

        if (mobile_media_query.matches) {
            toggle_node(100 + 20 * index);
        } else if (tablet_media_query.matches) {
            toggle_node(80 + 21 * index);
        } else {
            toggle_node(80 + 20 * index);
        }
    }

    /**
     *
     * @param {HTMLDivElement} note
     * @returns
     */
    const show_height_note = (note) => () =>
        !note.classList.contains("active") && gsap.to(note, { height: "45%", duration: 0.02 });

    /**
     *
     * @param {HTMLDivElement} note
     * @returns
     */
    const hide_height_note = (note) => () =>
        !note.classList.contains("active") && gsap.to(note, { height: "30%", duration: 0.02 });

    function add_events_notes() {
        notes.forEach((note, i) => {
            let touchTimer = null;
            let touchedHover = false;

            note.addEventListener("click", (evt) => !touchedHover && show_or_hide_note(note, i));

            if (!size_tablet_or_smaller.matches) {
                note.addEventListener("mouseenter", show_height_note(note));
                note.addEventListener("mouseleave", hide_height_note(note));
            } else {
                note.addEventListener("touchstart", () => {
                    touchTimer = setTimeout(() => {
                        show_height_note(note)();
                        touchedHover = true;
                    }, 300);
                });
                note.addEventListener("touchend", () => {
                    if (!touchedHover) return;

                    touchTimer && clearTimeout(touchTimer);
                    touchedHover = false;
                    hide_height_note(note)();
                });
            }
        });
    }

    function notes_ready() {
        const content = document.querySelector(".love-notes");

        const totalHeight = 170 + messages.length * 80;

        gsap.set(content, {
            height: `${totalHeight}px`,
            duration: 0.5,
            onComplete: () => {
                envelop.classList.add("open");
                add_events_notes();

                music1.addEventListener("ended", () => play_music_with_fade(music2));
                play_music_with_fade(music1);
            },
        });
    }

    function set_up_paper() {
        gsap.set(".js-up-paper", {
            bottom: "97%",
            rotation: 180,
            zIndex: 200,
            clipPath: "polygon(0% 0%, 100% 0%, 50% 61%)",
            onComplete: notes_ready,
        });
    }

    function envelop_transition() {
        gsap.to(".js-up-paper", {
            bottom: "1%",
            duration: 0.25,
            onComplete: set_up_paper,
        });

        upPaper.classList.remove("cursor");
        upPaper.removeAttribute("title");
        upPaper.removeEventListener("click", envelop_transition);
    }

    function removeSticker() {
        gsap.set(".js-sticker", {
            width: "20%",
            left: "-80%",
            backgroundRepeat: "no-repeat",
            duration: 0.25,
            onComplete: () => {
                sticker.classList.remove("scissors");
                sticker.removeEventListener("click", sticker);

                upPaper.classList.add("cursor");
                upPaper.setAttribute("title", "Click para abrir a carta");
                upPaper.addEventListener("click", envelop_transition);
            },
        });
    }

    document.addEventListener("DOMContentLoaded", add_notes);
    sticker.addEventListener("click", removeSticker);

    window.onresize = resize_notes;
})();
