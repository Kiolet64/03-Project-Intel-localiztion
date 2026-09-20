const rtlLanguages = new Set([
  "ar",
  "fa",
  "he",
  "ku",
  "ps",
  "ur",
  "yi"
]);

const bootstrapCss = document.querySelector("#bootstrap-css");
const rtlBootstrapUrl = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.rtl.min.css";
const ltrBootstrapUrl = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css";
const rtlBootstrapIntegrity = "sha384-CfCrinSRH2IR6a4e6fy2q6ioOX7O6Mtm1L9vRvFZ1trBncWmMePhzvafv7oIcWiW";

function languageIsRtl(language) {
  const baseLanguage = language.toLowerCase().split("-")[0].split("_")[0];
  return rtlLanguages.has(baseLanguage);
}

function getTranslatedLanguage() {
  const htmlClasses = document.documentElement.className;
  const bodyClasses = document.body ? document.body.className : "";

  if (/\btranslated-rtl\b/.test(`${htmlClasses} ${bodyClasses}`)) {
    return "rtl";
  }

  if (/\btranslated-ltr\b/.test(`${htmlClasses} ${bodyClasses}`)) {
    return "ltr";
  }

  const translationCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("googtrans="));

  if (translationCookie) {
    const translatedLanguage = decodeURIComponent(translationCookie).split("/").pop();
    if (translatedLanguage) {
      return translatedLanguage;
    }
  }

  return document.documentElement.lang || "en";
}

function updateTextDirection() {
  const isRtl = languageIsRtl(getTranslatedLanguage());
  const direction = isRtl ? "rtl" : "ltr";
  const stylesheetUrl = isRtl ? rtlBootstrapUrl : ltrBootstrapUrl;

  document.documentElement.dir = direction;

  if (bootstrapCss && bootstrapCss.href !== stylesheetUrl) {
    bootstrapCss.href = stylesheetUrl;

    if (isRtl) {
      bootstrapCss.integrity = rtlBootstrapIntegrity;
    } else {
      bootstrapCss.removeAttribute("integrity");
    }
  }
}

updateTextDirection();

document.addEventListener("change", (event) => {
  if (event.target.matches(".goog-te-combo")) {
    updateTextDirection();
  }
});

const languageObserver = new MutationObserver(updateTextDirection);
languageObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["class", "lang"]
});

if (document.body) {
  languageObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class", "lang"]
  });
}

setInterval(updateTextDirection, 500);
