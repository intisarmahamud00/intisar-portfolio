const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

const siteHeader = document.querySelector(".site-header");
const updateHeaderTheme = () => {
  if (!siteHeader) return;
  const probe = document.elementFromPoint(window.innerWidth / 2, siteHeader.offsetHeight + 4);
  const section = probe?.closest("[data-nav-theme]");
  siteHeader.classList.toggle("theme-dark", section?.dataset.navTheme === "dark");
  siteHeader.classList.toggle("theme-lime", section?.dataset.navTheme === "lime");
};

window.addEventListener("scroll", updateHeaderTheme, { passive: true });
window.addEventListener("resize", updateHeaderTheme);
updateHeaderTheme();

document.getElementById("year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const audioPlayer = document.getElementById("audio-cv-player");
const audioButton = document.getElementById("audio-play-button");
const audioStatus = document.getElementById("audio-status");
const audioProgress = document.getElementById("audio-progress-bar");

audioButton?.addEventListener("click", async () => {
  if (!audioPlayer) return;
  if (audioPlayer.paused) {
    try { await audioPlayer.play(); } catch { audioStatus.textContent = "Unable to play audio"; }
  } else {
    audioPlayer.pause();
  }
});

audioPlayer?.addEventListener("play", () => {
  audioButton?.classList.add("playing");
  audioButton?.setAttribute("aria-label", "Pause audio CV");
  audioButton?.setAttribute("aria-pressed", "true");
  audioStatus.textContent = "Now playing";
});
audioPlayer?.addEventListener("pause", () => {
  audioButton?.classList.remove("playing");
  audioButton?.setAttribute("aria-label", "Play audio CV");
  audioButton?.setAttribute("aria-pressed", "false");
  if (!audioPlayer.ended) audioStatus.textContent = "Paused";
});
audioPlayer?.addEventListener("timeupdate", () => {
  if (audioProgress && audioPlayer.duration) audioProgress.style.width = `${(audioPlayer.currentTime / audioPlayer.duration) * 100}%`;
});
audioPlayer?.addEventListener("ended", () => {
  audioStatus.textContent = "Ready to play again";
  if (audioProgress) audioProgress.style.width = "0%";
});

const form = document.getElementById("contact-form");
const status = form?.querySelector(".form-status");
const portfolioEmail = "intisarmahamud444@gmail.com";
const supabaseUrl = "https://vespblialjupatdtbuoe.supabase.co";
const supabasePublishableKey = "sb_publishable_0-ogUWe4sqmilEZNrTHMBQ_o2a7aQtg";

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const submitButton = form.querySelector('button[type="submit"]');
  status.classList.remove("error");
  const subject = data.subject?.trim() || "Portfolio enquiry";
  const body = `Hello Intisar,\n\nMy name: ${data.name}\nMy email: ${data.email}\n\n${data.message}\n\nBest regards,\n${data.name}`;
  const mailto = `mailto:${portfolioEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.textContent = "Sending your message...";
  submitButton?.setAttribute("disabled", "disabled");

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Supabase request failed");
    form.reset();
    status.textContent = "Thanks — your message has been sent.";
  } catch {
    status.textContent = "Opening your email app as a backup...";
    window.location.href = mailto;
  } finally {
    submitButton?.removeAttribute("disabled");
  }
});
