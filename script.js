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
